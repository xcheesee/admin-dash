'use client'

import { useEffect, useState } from "react";
import Form from "./Form";
import Input from "./input/InputField";
import Select, { Option } from "./Select";
import { CategoriaCorte } from "@/generated/prisma";

export default function FormAdicionarCorte() {
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

    //async function postCorte() {
    //    const dadosCorte = 
    //}

    return (
        <Form onSubmit={(e) => {
            const formData = new FormData(e.currentTarget);
            console.log(formData)
        }}>
            <div className="grid grid-cols-2 gap-4 p-4">
                <div className="col-span-2">Adicionar Corte</div> 
                <Input placeholder="Nome do Corte" name="nome-corte"/>
                <Input placeholder="Valor" name="valor-corte"/>
                <div className="col-span-2">
                    <Select options={corteCatSelectOptions} onChange={() => {}} name="tipo-corte"/>
                </div> 
                <div className="col-span-2"><button className="bg-blue-600 text-white rounded-2xl w-full py-4">Adicionar</button></div>
            </div>
        </Form>
    )
}