'use client'
import "@mantine/core/styles.css";
import "./landing.css";
import EntryPage from './Register/page';


export default function Home() {
  return (
    <div className = "landing-container">
      <EntryPage/>
    </div>
  );
}
