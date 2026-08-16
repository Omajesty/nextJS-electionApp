import Head from "next/head";
import { ElectionApp } from "@/components/ElectionApp";

export default function Home() {
  return (
    <>
      <Head>
        <title>HOH Election | Africa Plan Foundation</title>
        <meta
          name="description"
          content="Hackathon Africa 3.0 Head of House election. Registered voters can vote once for an official candidate."
        />
      </Head>
      <ElectionApp />
    </>
  );
}
