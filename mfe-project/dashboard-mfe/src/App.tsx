import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Panel } from "host/shared";

type Order = { id: string; item: string; quantity: number; price: number; status: string };
export default function App() {
  
  const user = useSelector((state: { auth: { user: { name: string } | null } }) => state.auth.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("http://localhost:3000/api/orders", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("mfe_token") || ""}`,
      },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Could not load orders"))))
      .then((result) => setOrders(result.orders || result))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    
  }, []);
// throw new Error("Test crash triggered by user!");
  return (
    <main className="page">
      <Panel title={`Dashboard${user ? ` · ${user?.name}` : ""}`}>
        <p>Recent orders from the Order Service</p>
        {error && <p className="error">{error}</p>}
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} aria-live="polite">Loading orders...</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.item}</td>
                  <td>₹{order.price.toLocaleString()}</td>
                  <td>{order.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Panel>
    </main>
  );
}
