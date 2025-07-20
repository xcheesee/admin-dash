'use client'

import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import Form from "../Form";
import Input from "../input/InputField";
import Select, { Option } from "../Select";
import { CategoriaCorte } from "@/generated/prisma";
import { CorteComCategoria } from "@/lib/types";

export default function FormEditarCorte({
    onSuccess,
    onSubmit,
    defaultValue
}: {
    onSuccess: (args?: any) => void,
    onSubmit: (arg: any) => void,
    defaultValue: CorteComCategoria | null
}) {
    const [corteCategorias, setCorteCategorias] = useState<CategoriaCorte[]>([]);

    useEffect(() => {
        getCategoriasCorte();
    }, [])

    async function getCategoriasCorte() {
        const res = await fetch('/api/categoriasCortes');
        if(res.ok) {
            const body = await res.json();
            setCorteCategorias(body.data);
        }
    }

    const corteCatSelectOptions: Option[] = corteCategorias?.map((categoria: CategoriaCorte) => {
        return {value: categoria.id.toString(), label: categoria.nome};
    })

    async function putCorte(htmlEvent: FormEvent<HTMLFormElement>) {
        const formData = new FormData(htmlEvent.currentTarget);
        const corte = {
            id: formData.get('id'),
            nome: formData.get('nome'),
            valor: formData.get('valor'),
            categoriaId: Number(formData.get('categoriaId'))
        };
        console.log(corte);

        const res = await fetch('/api/cortes/' + corte.id, {
            method: 'PUT',
            body: JSON.stringify({
                nome: corte.nome,
                valor: corte.valor,
                categoriaId: corte.categoriaId
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const resBody = await res.json();
        if(!res.ok) return false;
        return true;
    }

    return (
        <Form onSubmit={async (e) => {
            const corteCadastrado = await putCorte(e);
            if(corteCadastrado) {
                onSuccess();
                onSubmit(e);
            }
        }}>
            <div className="grid grid-cols-2 gap-4 p-4">
                <div className="col-span-2">Adicionar Corte</div> 
                <input type="hidden" defaultValue={defaultValue?.id ?? "0"} name="id" />
                <Input placeholder="Nome do Corte" name="nome" defaultValue={defaultValue?.nome ?? ""}/>
                <Input placeholder="Valor" name="valor" defaultValue={defaultValue?.valor ?? ""}/>
                <div className="col-span-2">
                    <Select placeholder="Tipo de Corte" defaultValue={defaultValue?.categoriaId.toString() ?? ""} options={corteCatSelectOptions} onChange={() => {}} name="categoriaId"/>
                </div> 
                <div className="col-span-2"><button className="bg-blue-600 text-white rounded-2xl w-full py-4">Editar</button></div>
            </div>
        </Form>
    )
}