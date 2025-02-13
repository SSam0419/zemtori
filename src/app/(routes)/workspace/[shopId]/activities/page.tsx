import React from "react";

import { GetActivities } from "@/app/_server/admin-actions/resources/activities/get-activities";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_shared/components/ui/table";

async function page() {
  const data = await GetActivities();
  const activities = data.success ? data.payload : [];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Content</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.map((activity) => {
          return (
            <TableRow key={activity.id}>
              <TableCell>{activity.createdAt}</TableCell>
              <TableCell>{activity.type}</TableCell>
              <TableCell>{activity.content}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default page;
