'use client'

import { updateStatus } from '@/lib/admin-actions'

export function StatusSelect({ id, currentStatus }: { id: number; currentStatus: string }) {
  return (
    <select
      defaultValue={currentStatus}
      className="border border-border rounded p-1"
      onChange={(e) => updateStatus(id, e.target.value)}
    >
      <option value="Available">Available</option>
      <option value="Rented">Rented</option>
      <option value="Damaged">Damaged</option>
      <option value="Under Review">Under Review</option>
      <option value="Retired">Retired</option>
    </select>
  )
}