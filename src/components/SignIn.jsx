import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { CircleLoader } from 'react-spinners';
import config from '../../config';

const SignIn = () => {
  const navigate = useNavigate();

  const validate = (values) => {
    const errors = {};
    if (!values.password) {
      errors.password = 'Required';
    } else if (values.password.length < 8) {
      errors.password = 'password must be at least 8 characters';
    }
    if (!values.email) {
      errors.email = 'Required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    return errors;
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      setStatus(null);
      const response = await axios.post(
        `${config.API_PREFIX}/auth/login`,
        {
          email: values.email,
          password: values.password,
        },
        {
          withCredentials: true,
        },
      );
      const token = localStorage.setItem(
        'token',
        response.data.data.token,
      );
      navigate('/dashboard');
    } catch (error) {
      setStatus('Signup failed. Please try again.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex">
      <div className="ml-6 flex-col justify-between p-8">
        <header className="font-bold text-2xl mb-8 text-center">
          Welcome to To-do app
        </header>
        <Formik
          initialValues={{ name: '', email: '' }}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className="flex flex-col gap-8 items-center">
              <div className="w-full">
                <Field
                  type="text"
                  id="email"
                  name="email"
                  placeholder="email ID"
                  className="p-2 w-full border border-gray-400 rounded"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  style={{ color: 'red' }}
                />
              </div>

              <div className="w-full">
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="p-2 w-full border border-gray-400 rounded"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  style={{ color: 'red' }}
                />
              </div>

              {status && (
                <div className="text-red-500 text-center">{status}</div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white p-2 w-full rounded"
              >
                {isSubmitting ? (
                  <CircleLoader
                    color="#fff"
                    loading={isSubmitting}
                    size={24}
                    className="mx-auto"
                  />
                ) : (
                  'Submit'
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignIn;
