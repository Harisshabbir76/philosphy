const getAdminDashboardEmail = () => {
  return (
    process.env.ADMIN_EMAIL_dashboard ||
    process.env.ADMIN_EMAIL_DASHBOARD ||
    process.env.ADMIN_EMAIL ||
    process.env.EMAIL_USER ||
    process.env.admin_email ||
    ""
  )
    .trim()
    .toLowerCase();
};

const isAdminEmail = (email) => {
  return Boolean(email) && email.trim().toLowerCase() === getAdminDashboardEmail();
};

module.exports = { getAdminDashboardEmail, isAdminEmail };
