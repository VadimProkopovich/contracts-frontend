import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space, message } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchLeads,
  createLead,
  updateLead,
  deleteLead,
} from "../services/api";

const LeadsTable = () => {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  // Fetch leads
  const { data: leads, isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: fetchLeads,
  });

  // Create lead
  const createMutation = useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      message.success("Lead created successfully!");
      setIsModalOpen(false);
    },
    onError: () => {
      message.error("Failed to create lead.");
    },
  });

  // Update lead
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      message.success("Lead updated successfully!");
      setIsModalOpen(false);
    },
    onError: () => {
      message.error("Failed to update lead.");
    },
  });

  // Delete lead
  const deleteMutation = useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      message.success("Lead deleted successfully!");
    },
    onError: () => {
      message.error("Failed to delete lead.");
    },
  });

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Source", dataIndex: "source", key: "source" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditingLead(record);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button danger onClick={() => deleteMutation.mutate(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleSubmit = (values) => {
    if (editingLead) {
      updateMutation.mutate({ id: editingLead.id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add Lead
      </Button>
      <Table
        columns={columns}
        dataSource={
          leads?.data?.map((lead) => ({ ...lead, key: lead.id })) || []
        }
        loading={isLoading}
      />
      <Modal
        title={editingLead ? "Edit Lead" : "Add Lead"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form initialValues={editingLead || {}} onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input the email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please input the status!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="source"
            label="Source"
            rules={[{ required: true, message: "Please input the source!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingLead ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LeadsTable;
