import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
  const ticketsList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href={`/tickets/${ticket.id}`}>View</Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketsList}</tbody>
      </table>
    </div>
  );
};

// this function executes only when server side rendering needs to happen. Any data that is returned, will show on the component props
// if we want to fetch data during ssr, we need to do it in this function, cannot be don in the component.
// When the app executes inside the browser, we fully rely on the component, and not on this function
LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets");

  return { tickets: data };
};

export default LandingPage;
