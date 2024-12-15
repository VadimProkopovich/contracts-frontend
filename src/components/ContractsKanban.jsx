import React, { useState } from "react";
import { Card, Drawer, Typography, Space, message } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchContracts, updateContract } from "../services/api";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./ContractsKanban.css";

const { Title, Text } = Typography;

// Drag-and-Drop Types
const ItemType = {
  CARD: "CARD",
};

// Русские заголовки колонок
const statuses = {
  DRAFT: "Черновики",
  PENDING: "В ожидании",
  APPROVED: "Одобрено",
  REJECTED: "Отклонено",
  COMPLETED: "Завершено",
};

const KanbanCard = ({ contract, moveCard, openDrawer }) => {
  const [, drag] = useDrag({
    type: ItemType.CARD,
    item: { id: contract.id, status: contract.status },
  });

  return (
    <Card
      ref={drag}
      className="kanban-card"
      hoverable
      onClick={() => openDrawer(contract)}
    >
      <Text strong>{contract.name}</Text>
    </Card>
  );
};

const KanbanColumn = ({ status, contracts, moveCard, openDrawer }) => {
  const [, drop] = useDrop({
    accept: ItemType.CARD,
    drop: (item) => moveCard(item.id, status),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className="kanban-column">
      <Title level={4} className="kanban-column-title">
        {statuses[status]}
      </Title>
      <div className="kanban-column-content">
        {contracts.map((contract) => (
          <KanbanCard
            key={contract.id}
            contract={contract}
            moveCard={moveCard}
            openDrawer={openDrawer}
          />
        ))}
      </div>
    </div>
  );
};

const ContractsKanban = () => {
  const queryClient = useQueryClient();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  // Fetch contracts
  const { data: contracts, isLoading } = useQuery({
    queryKey: ["contracts"],
    queryFn: fetchContracts,
  });

  // Update contract
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateContract(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      message.success("Статус договора обновлен!");
    },
    onError: () => {
      message.error("Ошибка обновления статуса.");
    },
  });

  // Move card to another column
  const moveCard = (id, newStatus) => {
    const contract = contracts.data.find((c) => c.id === id);
    if (contract.status === newStatus) return;

    updateMutation.mutate({ id, data: { ...contract, status: newStatus } });
  };

  // Open Drawer
  const openDrawer = (contract) => {
    setSelectedContract(contract);
    setDrawerVisible(true);
  };

  // Close Drawer
  const closeDrawer = () => {
    setSelectedContract(null);
    setDrawerVisible(false);
  };

  const groupedContracts = contracts?.data?.reduce((acc, contract) => {
    acc[contract.status] = acc[contract.status] || [];
    acc[contract.status].push(contract);
    return acc;
  }, {});

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="kanban-board">
        {Object.keys(statuses).map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            contracts={groupedContracts?.[status] || []}
            moveCard={moveCard}
            openDrawer={openDrawer}
          />
        ))}
      </div>

      <Drawer
        title={selectedContract?.name || "Детали договора"}
        placement="right"
        onClose={closeDrawer}
        open={drawerVisible}
      >
        {selectedContract ? (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text>
              <strong>ID:</strong> {selectedContract.id}
            </Text>
            <Text>
              <strong>Статус:</strong> {statuses[selectedContract.status]}
            </Text>
            <Text>
              <strong>Сумма:</strong> {selectedContract.amount}
            </Text>
            <Text>
              <strong>Описание:</strong> {selectedContract.description}
            </Text>
            <Text>
              <strong>Ссылка на документ:</strong>{" "}
              <a
                href={selectedContract.documentLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selectedContract.documentLink}
              </a>
            </Text>
            <Text>
              <strong>Создано:</strong>{" "}
              {new Date(selectedContract.createdAt).toLocaleString()}
            </Text>
            <Text>
              <strong>Обновлено:</strong>{" "}
              {new Date(selectedContract.updatedAt).toLocaleString()}
            </Text>
          </Space>
        ) : (
          <Text>Выберите договор для просмотра.</Text>
        )}
      </Drawer>
    </DndProvider>
  );
};

export default ContractsKanban;
