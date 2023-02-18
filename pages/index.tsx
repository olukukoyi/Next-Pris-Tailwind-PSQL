"use client";

import { useState } from "react";
import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";

interface FormData {
  title: string;
  content: string;
  id: string;
}

interface Notes {
  notes: {
    title: string;
    content: string;
    id: string;
  }[];
}

export default function Home({ notes }: Notes) {
  const [form, setForm] = useState<FormData>({
    title: "",
    content: "",
    id: "",
  });

  console.log(notes);

  const create = async (data: FormData) => {
    try {
      await fetch("http://localhost:3000/api/create", {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }).then(() => setForm({ title: "", content: "", id: "" }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (data: FormData) => {
    try {
      create(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1 className="text-center font-bold text-2xl mt-4">Notes</h1>
      <form
        className="w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch"
        onSubmit={(e: any) => {
          e.preventDefault();
          handleSubmit(form);
        }}
      >
        <input
          placeholder="text"
          value={form.title}
          onChange={(e) => {
            setForm({ ...form, title: e.target.value });
          }}
          className="border-2 rounded border-gray-600 p-1"
        />
        <textarea
          placeholder="content"
          value={form.content}
          onChange={(e) => {
            setForm({ ...form, content: e.target.value });
          }}
          className="border-2 rounded border-gray-600 p-1"
        />
        <button className="bg-blue-500 text-white rounded p-1" type="submit">
          Add+
        </button>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const notes = await prisma.note.findMany({
    select: {
      title: true,
      id: true,
      content: true,
    },
  });
  return {
    props: {
      notes,
    },
  };
};
