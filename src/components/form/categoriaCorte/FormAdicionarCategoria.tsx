'use client'

import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import Form from "../Form";
import Input from "../input/InputField";
import Select, { Option } from "../Select";
import { CategoriaCorte } from "@/generated/prisma";
import Spinner from "@/components/ui/Spinner";

export default function FormAdicionarCategoria({
    onSuccess,
    onSubmit
}: {
    onSuccess: (args?: any) => void
    onSubmit: (arg: any) => void
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
            setIsLoading(true);
            const categoriaCadastrada = await postCategoria(e);
            setIsLoading(false);
            if(categoriaCadastrada) {
                onSuccess();
                onSubmit(e);
            }
        }}>
            <div className="grid grid-cols-2 gap-4 p-4">
                <div className="col-span-2">Adicionar Categoria</div> 
                <Input placeholder="Nome da Categoria" name="nome"/>
                <div className="col-span-2"><button className="bg-blue-600 text-white rounded-2xl w-full py-4" disabled={isLoading}><div className="flex justify-center items-center gap-8">Adicionar {isLoading && <Spinner />}</div></button></div>
            </div>
        </Form>
    )
}