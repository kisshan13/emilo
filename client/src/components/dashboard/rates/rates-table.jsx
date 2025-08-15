import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function RatesTable({ data,  }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Views Rate</TableHead>
            <TableHead>Likes Rate</TableHead>
            <TableHead>Effective From</TableHead>
            <TableHead>Effective To</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.length ? (
            data.map((rate) => (
              <TableRow key={rate.id}>
                <TableCell>$ {rate.viewsRate}</TableCell>
                <TableCell>$ {rate.likesRate}</TableCell>
                <TableCell>
                  {new Date(rate.effectiveFrom).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(rate.effectiveTo).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                No rates found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
