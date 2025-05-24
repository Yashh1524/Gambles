'use client';
import React, { useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

const columns = [
    columnHelper.accessor('betAmount', {
        header: 'Bet Amount',
        cell: info => `₹${info.getValue()}`,
    }),
    columnHelper.accessor('winAmount', {
        header: 'Win Amount',
        cell: info => `₹${info.getValue()}`,
    }),
    columnHelper.accessor(row => {
        if (row.winAmount > 0 && row.betAmount > 0) {
            return (row.winAmount / row.betAmount).toFixed(2);
        }
        return '0.00';
    }, {
        id: 'multiplier',
        header: 'Multiplier',
        cell: info => `${info.getValue()}x`,
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: info => info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1),
    }),
    columnHelper.accessor('createdAt', {
        header: 'Date',
        cell: info => new Date(info.getValue()).toLocaleString(),
    }),
];

export default function UserBetsTable({ bets }) {
    const [rowCount, setRowCount] = useState(10);

    const table = useReactTable({
        data: bets.slice(0, rowCount),
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="bg-[#1f2937] p-4 rounded-xl border border-gray-700 shadow-md">
            <div className="flex items-center justify-end mb-3">
                <label className="text-sm text-gray-400 mr-2">Show rows:</label>
                <select
                    className="bg-[#111827] text-white border border-gray-600 rounded px-2 py-1"
                    value={rowCount}
                    onChange={(e) => setRowCount(Number(e.target.value))}
                >
                    {[10, 50, 100, 1000].map((count) => (
                        <option key={count} value={count}>{count}</option>
                    ))}
                </select>
            </div>
            <div className="overflow-x-auto rounded-xl">
                <table className="min-w-full text-sm text-left text-white">
                    <thead className="bg-gray-800 text-gray-400">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="px-4 py-3">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="text-white">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="border-b border-gray-700">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-4 py-2">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
