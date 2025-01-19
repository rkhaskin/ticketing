import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

// this function executes only when server side rendering needs to happen. Any data that is returned, will show on the component props
// if we want to fetch data during ssr, we need to do it in this function, cannot be don in the component.
// When the app executes inside the browser, we fully rely on the component, and not on this function
LandingPage.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get("/api/users/currentuser");

  return data;
};

export default LandingPage;
