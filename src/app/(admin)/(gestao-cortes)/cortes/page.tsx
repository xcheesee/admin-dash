import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TabelaCortes from "@/components/tables/TabelaCortes";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Bar Chart | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Bar Chart page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Cortes" />
      <div className="space-y-6">
        <ComponentCard title="Cortes">
          <TabelaCortes />
        </ComponentCard>
      </div>
    </div>
  );
}
