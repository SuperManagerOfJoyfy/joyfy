'use client'
import React from 'react'
import { ToastContainer } from 'react-toastify'

export const ToastSnackbar = () => {
	return (
		<>
			<ToastContainer
				theme='dark'
				position="bottom-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop
			/>
		</>
	)
}