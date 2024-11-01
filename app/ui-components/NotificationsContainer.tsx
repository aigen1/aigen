'use client';

import React from 'react';
import { ToastContainer } from 'react-toastify';

function NotificationsContainer() {
	return (
		<ToastContainer
			position='top-right'
			autoClose={5000}
			hideProgressBar
			newestOnTop
			closeOnClick
			rtl={false}
			pauseOnFocusLoss
			draggable
			pauseOnHover
		/>
	);
}

export default NotificationsContainer;
