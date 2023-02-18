"use client";

import { useState } from "react";
import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import { useRouter } from "next/router";

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
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const create = async (data: FormData) => {
    if (data.content.length > 0 && data.title.length > 0) {
      try {
        await fetch("http://localhost:3000/api/create", {
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        }).then(() => {
          setForm({ title: "", content: "", id: "" });
          refreshData();
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Fill Out ALL Fields Please");
    }
  };

  const deleteNote = async (id: String) => {
    try {
      await fetch(`http://localhost:3000/api/note/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      }).then(() => {
        refreshData();
      });
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
      <div className="w-auto min-w-[25%] max-w-min mt-20 mx-auto space-y-6 flex flex-col items-start">
        <ul>
          {notes?.map((note) => (
            <li key={note.id} className="border-b gorder-gray-600 p-2">
              <div className="flex justify-between">
                <div className="flex-1">
                  <h3 className="font-bold">{note.title}</h3>
                  <p className="text-sm">{note.content}</p>
                </div>
                <button
                  className="bg-red-500 ml-5 px-3 text-white rounded "
                  onClick={() => {
                    deleteNote(note.id);
                  }}
                >
                  X
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
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
