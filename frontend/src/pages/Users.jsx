import Table from '@components/Table';
import useUsers from '@hooks/users/useGetUsers.jsx';
import Search from '../components/Search';
import Popup from '../components/Popup';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/users.css';
import useEditUser from '@hooks/users/useEditUser';
import useDeleteUser from '@hooks/users/useDeleteUser';
import Form from '@components/Form';
import { register } from '@services/auth.service.js';
import useRegister from '@hooks/auth/useRegister.jsx';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const Users = () => {
  const { users, fetchUsers, setUsers } = useUsers();
  const [filterRut, setFilterRut] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);

  const {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    dataUser,
    setDataUser
  } = useEditUser(setUsers);

  const { handleDelete } = useDeleteUser(fetchUsers, setDataUser);
  
  const {
    errorEmail,
    errorRut,
    errorData,
    handleInputChange
  } = useRegister();

  const handleRutFilterChange = (e) => {
    setFilterRut(e.target.value);
  };

  const handleSelectionChange = useCallback((selectedUsers) => {
    setDataUser(selectedUsers);
  }, [setDataUser]);

  const handleRegisterNewUser = async (data) => {
    setIsLoadingRegister(true);
    try {
      const response = await register(data);
      if (response.status === 'Success') {
        showSuccessAlert('¡Registrado!', 'Usuario registrado exitosamente.');
        setShowRegisterModal(false);
        fetchUsers(); // Recargar la tabla de usuarios
        // Limpiar el formulario
        document.querySelectorAll('.form-input-field, .form-select-field').forEach(field => {
          field.value = '';
        });
      } else if (response.status === 'Client error') {
        errorData(response.details);
      }
    } catch (error) {
      console.error("Error al registrar un usuario: ", error);
      showErrorAlert('Cancelado', 'Ocurrió un error al registrar el usuario.');
    } finally {
      setIsLoadingRegister(false);
    }
  };

  const columns = [
    { title: "Nombre", field: "nombreCompleto", width: 350, responsive: 0 },
    { title: "Correo electrónico", field: "email", width: 300, responsive: 3 },
    { title: "Rut", field: "rut", width: 150, responsive: 2 },
    { title: "Rol", field: "rol", width: 200, responsive: 2 },
    { title: "Creado", field: "createdAt", width: 200, responsive: 2 }
  ];

  const patternRut = new RegExp(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)

  return (
    <div className='main-container'>
      <div className='table-container'>
        <div className='top-table'>
          <h1 className='title-table'>Usuarios</h1>
          <div className='filter-actions'>
            <button 
              className='new-user-button'
              onClick={() => setShowRegisterModal(true)}
              title="Registrar nuevo usuario"
            >
              ➕ Nuevo Usuario
            </button>
            <Search value={filterRut} onChange={handleRutFilterChange} placeholder={'Filtrar por rut'} />
            <button onClick={handleClickUpdate} disabled={dataUser.length === 0}>
              {dataUser.length === 0 ? (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              ) : (
                <img src={UpdateIcon} alt="edit" />
              )}
            </button>
            <button className='delete-user-button' disabled={dataUser.length === 0} onClick={() => handleDelete(dataUser)}>
              {dataUser.length === 0 ? (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              ) : (
                <img src={DeleteIcon} alt="delete" />
              )}
            </button>
          </div>
        </div>
        <Table
          data={users}
          columns={columns}
          filter={filterRut}
          dataToFilter={'rut'}
          initialSortName={'nombreCompleto'}
          onSelectionChange={handleSelectionChange}
        />
      </div>
      <Popup show={isPopupOpen} setShow={setIsPopupOpen} data={dataUser} action={handleUpdate} />
      
      {/* Modal para registrar nuevo usuario */}
      {showRegisterModal && (
        <div className='modal-overlay' onClick={() => setShowRegisterModal(false)}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <button 
              className='modal-close-btn'
              onClick={() => setShowRegisterModal(false)}
            >
              ✕
            </button>
            <Form
              title="Registrar Nuevo Usuario"
              fields={[
                {
                  label: "Nombre completo",
                  name: "nombreCompleto",
                  placeholder: "Diego Alexis Salazar Jara",
                  fieldType: 'input',
                  type: "text",
                  required: true,
                  minLength: 15,
                  maxLength: 50,
                  pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                  patternMessage: "Debe contener solo letras y espacios",
                },
                {
                  label: "Correo electrónico",
                  name: "email",
                  placeholder: "example@lab.cl",
                  fieldType: 'input',
                  type: "email",
                  required: true,
                  minLength: 10,
                  maxLength: 35,
                  errorMessageData: errorEmail,
                  validate: {
                    emailDomain: (value) => value.endsWith('@lab.cl') || 'El correo debe terminar en @lab.cl'
                  },
                  onChange: (e) => handleInputChange('email', e.target.value)
                },
                {
                  label: "Rut",
                  name: "rut",
                  placeholder: "23.770.330-1",
                  fieldType: 'input',
                  type: "text",
                  minLength: 9,
                  maxLength: 12,
                  pattern: patternRut,
                  patternMessage: "Debe ser xx.xxx.xxx-x o xxxxxxxx-x",
                  required: true,
                  errorMessageData: errorRut,
                  onChange: (e) => handleInputChange('rut', e.target.value)
                },
                {
                  label: "Contraseña",
                  name: "password",
                  placeholder: "**********",
                  fieldType: 'input',
                  type: "password",
                  required: true,
                  minLength: 8,
                  maxLength: 26,
                  pattern: /^[a-zA-Z0-9]+$/,
                  patternMessage: "Debe contener solo letras y números",
                },
              ]}
              buttonText={isLoadingRegister ? "Registrando..." : "Registrar Usuario"}
              onSubmit={handleRegisterNewUser}
              isLoading={isLoadingRegister}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;