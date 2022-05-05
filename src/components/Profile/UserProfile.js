import ProfileForm from "./ProfileForm";
import classes from "./UserProfile.module.css";

const UserProfile = () => {
  return (
    <section className={classes.profile}>
      <h2>DashBoard</h2>

      <ProfileForm />
    </section>
  );
};

export default UserProfile;
