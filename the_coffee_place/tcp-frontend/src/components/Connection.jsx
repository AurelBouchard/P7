import React, {useEffect, useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import axios from 'axios';

import Button from './TCP_button';
import DbError from './DbError';



export let JWT_token = "";




const Connection = ({setJWT_token, setIsAdmin, setConnected, setAskForSubscription, setCurrentUser}) => {
    const [dbError, setDbError] = useState(null);

    const lastUser = localStorage.getItem('tcp_user');

    useEffect(() => { document.title = "Connexion"; })

    return (
        <div className="flex flex-col justify-between items-center w-full h-full">
            <div className="flex flex-col mt-8 md:mt-16 md:mb-8 lg:mt-32 font-SCRIPT text-3xl">
                <p className="md:text-4xl lg:text-5xl">The Coffee Place</p>
                {/*<p className="pr-2 w-full sm:text-3xl md:text-4xl text-right">... la salle de pause de Groupomania</p>*/}
            </div>
            <Formik
                initialValues={{pseudo: lastUser, password: ''}}
                validate={values => {
                    const errors = {};
                    if (!values.pseudo) {
                        errors.pseudo = 'Champ requis';
                    }
                    if (!values.password) {
                        errors.password = 'Champ requis';
                    }
                    return errors;
                }}
                onSubmit={(values, {setSubmitting}) => {
                    setTimeout(() => {

                        console.log("try to connect ...");

                        const payload = {
                            pseudo:     values.pseudo,
                            password:   values.password
                        }

                        axios.post('http://localhost:4000/api/user/login', payload)
                            .then(function (response) {
                                console.log("response.data :");
                                console.log(response.data);
                                return ({token: 'Bearer '+response.data.token, isAdmin: response.data.isAdmin});


                            })
                            .then(({token, isAdmin}) => {
                                console.log(token)
                                console.log("tout est ok !!");
                                setJWT_token(token);

                                //axios.defaults.baseURL = 'https:
                                axios.defaults.headers.common['Authorization'] = token;

                                setAskForSubscription(false);
                                localStorage.setItem('tcp_user', values.pseudo)
                                setCurrentUser(values.pseudo);
                                isAdmin && setIsAdmin(true);
                                console.log("Vous êtes connecté(e) en tant que " + values.pseudo)
                            })
                            .catch(err => {
                                console.log(err)
                                setDbError(err.message);
                            });


                        setSubmitting(false);
                    }, 400);
                }}
            >
                {({isSubmitting}) => (
                    <Form>
                        <div className="w-11/12 max-w-sm mx-auto">
                            <div className="bg-white rounded-2xl shadow-lg mt-20 flex flex-col">
                                <div className="bg-gradient-to-tl from-prim to-prim-light
                                rounded-2xl shadow-lg p-8 w-min mx-auto -mt-10" >
                                    <p className="text-white text-2xl">Connexion</p>
                                </div>

                                <div className="px-4">
                                    <div className="mt-4 mb-8 px-4">
                                        <label htmlFor='pseudo' className='block'>Pseudo</label>
                                        <Field name="pseudo" placeholder="pseudo" autoComplete="nickName"/>
                                        <ErrorMessage name="pseudo" component="div"
                                                      className='mb-1 text-red-500'/>
                                    </div>
                                    <div className="mb-4 px-4">
                                        <label htmlFor='password' className='block'>Mot de passe</label>
                                        <Field type="password" name="password" placeholder="mot_de_passe" autoComplete="current-password"/>
                                        <ErrorMessage name="password" component="div"
                                                      className='mb-1 text-red-500'/>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-center">
                                        <Button
                                            text="Se connecter"
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>

            <div className="mt-12">
                <Button text="Créez un compte en 30 seconde !"
                        onClick={() => {
                            setAskForSubscription(true)
                        }}
                >
                </Button>
            </div>

            {(!dbError) ? null : <DbError dbError={dbError} setDbError={setDbError}/>}

        </div>
    );
};


export default Connection;