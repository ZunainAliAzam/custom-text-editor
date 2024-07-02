import React, { useState } from "react";
import { Button, Modal, Form, InputNumber } from "antd";

const CreateModal = ({ onGenerate }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleSubmit = (values) => {
    setConfirmLoading(true);
    setTimeout(() => {
      onGenerate(values.rows, values.columns);
      setConfirmLoading(false);
      setOpen(false);
    }, 2000);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Create Table
      </Button>
      <Modal
        title="Create Table"
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
      >
        <Form onFinish={handleSubmit} initialValues={{ rows: 2, columns: 2 }}>
          <Form.Item
            label="Rows"
            name="rows"
            rules={[{ required: true, message: "Please input the number of rows!" }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            label="Columns"
            name="columns"
            rules={[{ required: true, message: "Please input the number of columns!" }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={confirmLoading}>
              Generate Table
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateModal;
