'use client'

import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import Form from "../Form";
import Input from "../input/InputField";
import Select, { Option } from "../Select";
import { CategoriaCorte } from "@/generated/prisma";

export default function FormAdicionarCategoria({
    onSuccess,
    onSubmit
}: {
    onSuccess: (args?: any) => void
    onSubmit: (arg: any) => void
}) {
    async function postCategoria(htmlEvent: FormEvent<HTMLFormElement>) {
        const formData = new FormData(htmlEvent.currentTarget);
        const res = await fetch('/api/categoriasCortes', {
            method: 'POST',
            body: JSON.stringify({
                nome: formData.get('nome'),
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if(!res.ok) return false;
        return true;
    }

    return (
        <Form onSubmit={async (e) => {
            const categoriaCadastrada = await postCategoria(e);
            if(categoriaCadastrada) {
                onSuccess();
                onSubmit(e);
            }
        }}>
            <div className="grid grid-cols-2 gap-4 p-4">
                <div className="col-span-2">Adicionar Categoria</div> 
                <Input placeholder="Nome da Categoria" name="nome"/>
                <div className="col-span-2"><button className="bg-blue-600 text-white rounded-2xl w-full py-4">Adicionar</button></div>
            </div>
        </Form>
    )
}