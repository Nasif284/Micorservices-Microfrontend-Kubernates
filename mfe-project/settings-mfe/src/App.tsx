import { useDispatch, useSelector } from "react-redux";
import { Panel } from "host/shared";
import { setNotifications, setTheme } from "host/store";

export default function App() {
  const dispatch = useDispatch();
  const settings = useSelector((state: { settings: { theme: "light" | "dark"; notifications: boolean } }) => state.settings);
  return (
    <main className="page">
      <Panel title="Application settings">
        <label className="field" htmlFor="theme">
          <span>Theme preference</span>
          <select id="theme" value={settings.theme} onChange={(e) => dispatch(setTheme(e.target.value as "light" | "dark"))}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label className="field" htmlFor="notifications">
          <span>Notifications</span>
          <input id="notifications" type="checkbox" checked={settings.notifications} onChange={(e) => dispatch(setNotifications(e.target.checked))} />
        </label>
        <p className="success">Settings are stored in the shared Redux store.</p>
      </Panel>
    </main>
  );
}
