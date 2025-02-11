// if we want to include some global css into our project, we can only import it into this _app file, so every component will get it
// _app.js is the only file that guarantees that the css
import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

// wrapper around Component to enrich it with css
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

// the param object into getInitialProps on the _app has a different structure than on the page
// on the page {req} is directly on the object, in the _app it is {ctx: {req}}
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  // _app getInitialProps prevents any page getInitialProps from being called automatically.
  // a page that we want to render might have getInitialProps of its own. We cal it manually:
  // Component property in the appContext has the component name we are trying to render. We can check if getInitialProps is present on the Component
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
