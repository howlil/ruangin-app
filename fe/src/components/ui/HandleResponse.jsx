import toast from "react-hot-toast";

const toastConfig = {
  duration: 3000,
  style: { minWidth: '250px' },
};

export const HandleResponse = ({
  response = null,
  error = null,
  successMessage = "Action completed successfully!",
  errorMessage = "An error occurred!"
}) => {
  // Case 1: No Response
  if (!response && !error) {
    return toast.error("No response from server", {
      ...toastConfig,
      icon: '❌'
    });
  }

  // Case 2: Success Response
  if (response && (response.status === 200 || response.status === 201)) {
    const message = response?.data?.message || successMessage;
    return toast.success(message, {
      ...toastConfig,
      icon: '✅'
    });
  }

  // Case 3: Error Handling
  if (error) {
    // Case 3.1: String Error
    if (typeof error === "string") {
      return toast.error(error, toastConfig);
    }

    // Case 3.2: Error with Response Data
    if (error.response?.data) {
      const { data } = error.response;

      // Case 3.2.1: Multiple Errors
      if (data.errors && typeof data.errors === 'object') {
        const errors = Object.values(data.errors);
        return errors.forEach((err, index) => {
          setTimeout(() => {
            toast.error(err, {
              ...toastConfig,
              icon: '❌'
            });
          }, index * 500);
        });
      }

      // Case 3.2.2: Single Error Message
      if (data.message) {
        return toast.error(data.message, {
          ...toastConfig,
          icon: '❌'
        });
      }
    }

    // Case 3.3: Error with Message
    if (error.message) {
      return toast.error(error.message, {
        ...toastConfig,
        icon: '❌'
      });
    }
  }

  // Case 4: Unexpected Status Code
  if (response && response.status) {
    return toast.error(`Unexpected status code: ${response.status}`, {
      ...toastConfig,
      icon: '❌'
    });
  }

  // Case 5: Fallback Error
  return toast.error(errorMessage, {
    ...toastConfig,
    icon: '❌'
  });
};