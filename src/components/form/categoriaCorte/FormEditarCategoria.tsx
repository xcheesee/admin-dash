'use client'

import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import Form from "../Form";
import Input from "../input/InputField";
import Select, { Option } from "../Select";
import { CategoriaCorte } from "@/generated/prisma";
import { CorteComCategoria } from "@/lib/types";
import Spinner from "@/components/ui/Spinner";

export default function FormEditarCategoria({
    onSuccess,
    onSubmit,
    defaultValue
}: {
    onSuccess: (args?: any) => void,
    onSubmit: (arg: any) => void,
    defaultValue: CorteComCategoria | null
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function putCategoria(htmlEvent: FormEvent<HTMLFormElement>) {
        const formData = new FormData(htmlEvent.currentTarget);
        const categoria = {
            id: formData.get('id'),
            nome: formData.get('nome'),
            valor: formData.get('valor'),
            categoriaId: Number(formData.get('categoriaId'))
        };

        const res = await fetch('/api/categoriasCortes/' + categoria.id, {
            method: 'PUT',
            body: JSON.stringify({
                nome: categoria.nome,
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
            const categoriaCadastrada = await putCategoria(e);
            setIsLoading(false);
            if(categoriaCadastrada) {
                onSuccess();
                onSubmit(e);
            }
        }}>
            <div className="grid grid-cols-2 gap-4 p-4">
                <div className="col-span-2">Adicionar Categoria</div> 
                <input type="hidden" defaultValue={defaultValue?.id ?? "0"} name="id" />
                <Input placeholder="Nome da Categoria" name="nome" defaultValue={defaultValue?.nome ?? ""}/>
                <div className="col-span-2"><button className="bg-blue-600 text-white rounded-2xl w-full py-4" disabled={isLoading}><div className="flex justify-center items-center gap-8">Editar {isLoading && <Spinner />}</div></button></div>
            </div>
        </Form>
    )
}