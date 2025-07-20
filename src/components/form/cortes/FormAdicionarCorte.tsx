'use client'

import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import Form from "../Form";
import Input from "../input/InputField";
import Select, { Option } from "../Select";
import { CategoriaCorte } from "@/generated/prisma";
import Spinner from "@/components/ui/Spinner";

export default function FormAdicionarCorte({
    onSuccess,
    onSubmit
}: {
    onSuccess: (args?: any) => void
    onSubmit: (arg: any) => void
}) {
    const [corteCategorias, setCorteCategorias] = useState<CategoriaCorte[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        getCategoriasCorte();
    }, [])

    async function getCategoriasCorte() {
        setIsLoading(true);
        const res = await fetch('/api/categoriasCortes');
        if(res.ok) {
            const body = await res.json();
            setCorteCategorias(body.data);
        }
        setIsLoading(false);
    }

    const corteCatSelectOptions: Option[] = corteCategorias?.map((categoria: CategoriaCorte) => {
        return {value: categoria.id.toString(), label: categoria.nome};
    })

    async function postCorte(htmlEvent: FormEvent<HTMLFormElement>) {
        const formData = new FormData(htmlEvent.currentTarget);
        const res = await fetch('/api/cortes', {
            method: 'POST',
            body: JSON.stringify({
                nome: formData.get('nome'),
                valor: formData.get('valor'),
                categoriaId: Number(formData.get('categoriaId'))
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
            setIsLoading(true);
            const corteCadastrado = await postCorte(e);
            setIsLoading(false);
            if(corteCadastrado) {
                onSuccess();
                onSubmit(e);
            }
        }}>
            <div className="grid grid-cols-2 gap-4 p-4">
                <div className="col-span-2">Adicionar Corte</div> 
                <Input placeholder="Nome do Corte" name="nome"/>
                <Input placeholder="Valor" name="valor"/>
                <div className="col-span-2">
                    <Select placeholder={isLoading ? "...Carregando" :"Tipo de Corte"} options={corteCatSelectOptions} onChange={() => {}} name="categoriaId"/>
                </div> 
                <div className="col-span-2"><button className="bg-blue-600 text-white rounded-2xl w-full py-4" disabled={isLoading}><div className="flex justify-center items-center gap-8">Adicionar {isLoading && <Spinner />}</div></button></div>
            </div>
        </Form>
    )
}