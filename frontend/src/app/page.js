'use client'
import {redirect} from 'next/navigation';
import {MantineProvider } from '@mantine/core';

export default function Home() {

  return (
    <MantineProvider>
      <body>
        <h1>Title of Website</h1>
        <section>
          <h2>TODO: Service API below this header</h2>
          <a href = '/Register'>Register Page</a><br/>
          <a href = '/friends'>Friends Page</a><br/>
          <a href = '/maps'>Maps Page</a><br/>
          <a href = '/videos'>Videos Page</a>
        </section>
      </body>
    </MantineProvider>
  );
}
