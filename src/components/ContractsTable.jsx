import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchContracts,
  createContract,
  updateContract,
  deleteContract,
  fetchLeads,
} from "../services/api";
import dayjs from "dayjs";

const { Option } = Select;

const ContractsTable = () => {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState(null);

  // Fetch contracts
  const { data: contracts, isLoading } = useQuery({
    queryKey: ["contracts"],
    queryFn: fetchContracts,
  });

  // Fetch leads for dropdown
  const { data: leads } = useQuery({
    queryKey: ["leads"],
    queryFn: fetchLeads,
  });

  // Create contract
  const createMutation = useMutation({
    mutationFn: createContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      message.success("Contract created successfully!");
      setIsModalOpen(false);
    },
    onError: () => {
      message.error("Failed to create contract.");
    },
  });

  // Update contract
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateContract(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      message.success("Contract updated successfully!");
      setIsModalOpen(false);
    },
    onError: () => {
      message.error("Failed to update contract.");
    },
  });

  // Delete contract
  const deleteMutation = useMutation({
    mutationFn: deleteContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      message.success("Contract deleted successfully!");
    },
    onError: () => {
      message.error("Failed to delete contract.");
    },
  });

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Lead ID", dataIndex: "leadId", key: "leadId" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Document Link", dataIndex: "documentLink", key: "documentLink" },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt" },
    { title: "Updated At", dataIndex: "updatedAt", key: "updatedAt" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditingContract(record);
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
    const now = dayjs().toISOString();
    const preparedValues = {
      ...values,
      createdAt: editingContract?.createdAt || now, // Use existing createdAt or current time
      updatedAt: now, // Always use current time for updatedAt
    };

    if (editingContract) {
      updateMutation.mutate({ id: editingContract.id, data: preparedValues });
    } else {
      createMutation.mutate(preparedValues);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add Contract
      </Button>
      <Table
        columns={columns}
        dataSource={
          contracts?.data?.map((contract) => ({
            ...contract,
            key: contract.id,
            createdAt: contract.createdAt
              ? dayjs(contract.createdAt).format("YYYY-MM-DD HH:mm:ss")
              : "",
            updatedAt: contract.updatedAt
              ? dayjs(contract.updatedAt).format("YYYY-MM-DD HH:mm:ss")
              : "",
          })) || []
        }
        loading={isLoading}
      />
      <Modal
        title={editingContract ? "Edit Contract" : "Add Contract"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form initialValues={editingContract} onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="leadId"
            label="Lead"
            rules={[{ required: true, message: "Please select a lead!" }]}
          >
            <Select>
              {leads?.data?.map((lead) => (
                <Option key={lead.id} value={lead.id}>
                  {lead.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status!" }]}
          >
            <Select>
              {["DRAFT", "PENDING", "APPROVED", "REJECTED", "COMPLETED"].map(
                (status) => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                )
              )}
            </Select>
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: "Please input the amount!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
          <Form.Item name="documentLink" label="Document Link">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingContract ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContractsTable;
