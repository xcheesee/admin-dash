"use client"

import React, { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import pdfMake from 'pdfmake/build/pdfmake'
import "pdfmake/build/vfs_fonts";
import { CorteComCategoria } from "@/lib/types";
import { chunkArray } from "@/lib/utils";
import { Modal } from "../ui/modal";
import FormAdicionarCorte from "../form/cortes/FormAdicionarCorte";
import FormEditarCorte from "../form/cortes/FormEditarCorte";
import FormAdicionarCategoria from "../form/categoriaCorte/FormAdicionarCategoria";
import FormEditarCategoria from "../form/categoriaCorte/FormEditarCategoria";
import Spinner from "../ui/Spinner";

export default function TabelaCategoriasCortes() {
  const [categoriasCortes, setCategoriasCortes] = useState<CorteComCategoria[]>([]);
  const [selectedCategoriaCorte, setSelectedCategoriaCorte] = useState<CorteComCategoria | null>(null);

  const [loadingCategoriasCortes, setLoadingCategoriasCortes] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const [showModalAdicionar, setShowModalAdicionar] = useState<boolean>(false);
  const [showModalEditar, setShowModalEditar] = useState<boolean>(false);
  const [showModalExcluir, setShowModalExcluir] = useState<boolean>(false);

  useEffect(() => {
      getCategoriasCortes();
  }, [])

  async function getCategoriasCortes() {
    setLoadingCategoriasCortes(true);
      const res = await fetch('/api/categoriasCortes');
      if(res.ok) {
          const body = await res.json();
          setCategoriasCortes(body.data);
      }
      setLoadingCategoriasCortes(false);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    getCategoriasCortes();
  }

  async function onDeletePress() {
    setLoadingDelete(true);
    const res = await fetch('/api/categoriasCortes/' + selectedCategoriaCorte?.id, {
        method: 'DELETE'
    });
    setLoadingDelete(false);

    if(res.ok) {
        getCategoriasCortes();
    }

    setShowModalExcluir(false);
    return;
  }

  if(loadingCategoriasCortes) return (
    <div className="flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeDasharray="16" strokeDashoffset="16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3c4.97 0 9 4.03 9 9"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="16;0"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
    </div>);

  return (
    <>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                  isHeader
                                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                  Nome
                                </TableCell>
                                <TableCell
                                  isHeader
                                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                  Ações
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                          {categoriasCortes?.map((categoria) => (
                            <TableRow key={categoria.id}>
                              <TableCell className="px-5 py-4 sm:px-6 text-start">
                                <div className="flex items-center gap-3">
                                  <div>
                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                      {categoria.nome}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                <button className="pr-2" onClick={() => {
                                  setShowModalEditar(true);
                                  setSelectedCategoriaCorte(categoria);
                                }}>Editar</button>

                                <button className="pl-2 text-red-600" onClick={() => {
                                  setShowModalExcluir(true);
                                  setSelectedCategoriaCorte(categoria);
                                }}>Excluir</button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
        <button className="px-4 mx-4 bg-blue-600 text-white rounded-2xl" onClick={() => {
          setShowModalAdicionar(true);
        }}>Adicionar Categoria</button>
        <Modal 
          isOpen={showModalAdicionar} 
          onClose={() => {
            setShowModalAdicionar(false)
          }}
        >
            <FormAdicionarCategoria 
              onSuccess={() => {
              setShowModalAdicionar(false)
              }} 
              onSubmit={onSubmit} 
            />
        </Modal>

        <Modal 
          isOpen={showModalEditar} 
          onClose={() => {
            setShowModalEditar(false)
          }}
        >
            <FormEditarCategoria 
              onSuccess={() => {
                setShowModalEditar(false)
                getCategoriasCortes()
              }}
              onSubmit={() => {}}
              defaultValue={selectedCategoriaCorte}
            />
        </Modal>

        <Modal
            isOpen={showModalExcluir}
            onClose={() => {
                setShowModalExcluir(false)
            }}
            className="w-auto px-8 pb-4 pt-2"
        >
            <div className="text-center">Deseja realmente excluir o corte?</div>
            <div className="text-center font-light text-neutral-600">Essa acao ira excluir o corte "{selectedCategoriaCorte?.nome ?? "Nao encontrado"}" da lista de precos</div>
            <div className="flex justify-center gap-8 pt-8">
                <button 
                    className="bg-red-600 text-white py-2 px-4 rounded-2xl"
                    disabled={loadingDelete}
                    onClick={onDeletePress}
                ><div className="flex justify-center items-center gap-8">Excluir {loadingDelete && <Spinner />}</div></button>
                <button 
                    className="text-neutral-600" 
                    onClick={() => setShowModalExcluir(false)}
                >Cancelar</button>
            </div>
        </Modal>
    </>
  );
}
