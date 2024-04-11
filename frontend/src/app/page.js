'use client'
import "@mantine/core/styles.css";
import EntryPage from './register/page';
import axios from "axios";

export default function Home() {
  axios.defaults.withCredentials = true

  return (
    <div className = "landing-container">
      <EntryPage/>
    </div>
  );
}
