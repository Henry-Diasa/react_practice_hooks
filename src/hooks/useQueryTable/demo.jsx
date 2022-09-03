import { useCallback } from "react";
import useQueryTable from "./index";
import { Input, Select, Table } from "antd";
const Option = Select.Option;
function getTableData(payload) {
  return new Promise((resolve) => {
    Promise.resolve().then(() => {
      console.log("请求参数：", payload);
      const list = [0, 1, 2];
      resolve({
        list: [list[0], list[1], list[2]],
        total: list.length,
        current: payload.page || 1
      });
    });
  });
}
function Index() {
  const [table, form] = useQueryTable({ pageSize: 3 }, getTableData);
  const { formData, setFormItem, reset } = form;
  const { pagination, tableData, getList, handerChange } = table;
  return (
    <div style={{ margin: "30px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Input
          onChange={(e) => setFormItem("name", e.target.value)}
          placeholder="请输入名称"
          value={formData.name || ""}
        />
        <Input
          onChange={(e) => setFormItem("price", e.target.value)}
          placeholder="请输入价格"
          value={formData.price || ""}
        />
        <Select
          onChange={(value) => setFormItem("type", value)}
          placeholder="请选择"
          value={formData.type}
        >
          <Option value="1">家电</Option>
          <Option value="2">生活用品</Option>
        </Select>
        <button className="searchbtn" onClick={() => getList()}>
          提交
        </button>
        <button className="concellbtn" onClick={reset}>
          重置
        </button>
      </div>
      {useCallback(
        <Table
          columns={columns}
          dataSource={tableData.list}
          height="300px"
          onChange={(res) => {
            handerChange(res.current, res.pageSize);
          }}
          pagination={{
            ...pagination,
            total: tableData.total,
            current: tableData.current
          }}
          rowKey="id"
        />,
        [tableData]
      )}
    </div>
  );
}
