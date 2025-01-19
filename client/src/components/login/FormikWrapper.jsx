import React from 'react'
import {Formik, Form} from 'formik'
function FormikWrapper({children,  onSubmit, validationSchema, initialValues}) {
  return (
    <Formik
    initialValues={initialValues}
    onSubmit={onSubmit}
    validationSchema={validationSchema}
    >
        <Form>
            {children}
        </Form>
    </Formik>
  )
}

export default FormikWrapper
