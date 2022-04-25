import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import User from '../../models/user';
import AuthenticationService from './../../services/authentication.service';
import { setCurrentUser } from './../../store/actions/user';


const LoginPage = () => {

    const [user, setUser] = useState( new User('', '', ''));
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const currentUser = useSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

     //mounted
     useEffect(() => {
        if(currentUser?.id) {
            //navigate
            navigate('/profile');
        }
     }, []);
 
     //<input name='x' value='y' onChange=(event) => handleChange(event)>
     const handleChange = ( e ) => {
         const { name, value } = e.target;
 
         setUser( (prevState => {
             //e.g. prevState ({user:x, pass: y}) + newKeyValue( { user:xy }) => ({ user: xy, pass: x})
             return {
                 ...prevState,
                 [name] : value
             };
         }));
     };

    const handleLogin = (e) => {

        e.preventDefault();
        setSubmitted(true);

        if(!user.username || !user.password) {
            return;
        }
        setLoading(true);

     AuthenticationService.login(user).then(response => {
         //set user as a session
        dispatch(setCurrentUser(response.data));
        navigate('/profile');
     }).catch(error => {
        console.log(error);
        setErrorMessage('Username or password not valid!');
        setLoading(false);
    });
  };
    return ( 
        <div className='container mt-5'>
        <div className='card ms-auto me-auto p-3 shadow-lg custom-card'>
          <FontAwesomeIcon icon={faUserCircle} className="ms-auto me-auto user-icon"/>

          { errorMessage &&
          <div className='alert alert-danger'>
            {errorMessage}
          </div>
          }
          
          <form
            onSubmit={ (e) => handleLogin(e) }
            noValidate
            className={submitted ? 'was-validated' : ''} 
          >
              <div className='form-group'> 
                <label htmlFor='username'>Full username:</label>
                <input
                  type='text'
                  name='username'
                  className='form-control'
                  placeholder='username'
                  value={ user.username }
                  onChange={ (e) => handleChange(e) }
                  required
                />
                <div className='invalid-feedback'>
                   Username is required.
                </div>
              </div>

              <div className='form-group'> 
                <label htmlFor='password'>Password:</label>
                <input
                  type='password'
                  name='password'
                  className='form-control'
                  placeholder='password'
                  value={ user.password }
                  onChange={ (e) => handleChange(e) }
                  required
                />
                <div className='invalid-feedback'>
                   Password is required.
                </div>
              </div>
              <button className='btn btn-info w-100 mt-3' disabled={user.username === ''
              || user.password === '' ? true : false}>
                   Sign in
              </button>
          </form>

          <Link to="/register" className="btn btn-link" style={{color: 'darkgray'}}>
                Create New Account
          </Link>

        </div>
    </div>
    
    );
};

export {LoginPage};