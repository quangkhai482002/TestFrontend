import React, { useState } from "react";
import { Upload, Button, TimePicker, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "./App.css";

dayjs.extend(isBetween);

function App() {
  const [fileData, setFileData] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [total, setTotal] = useState(0);

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        range: 8,
      });

      const filteredData = jsonData.map((row) => ({
        time: row[2],
        amount: parseFloat(row[8]),
      }));

      setFileData(filteredData);
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  const validateTime = (start, end) => {
    if (end.isBefore(start)) {
      notification.error({
        message: "Lỗi thời gian",
        description: "Thời gian kết thúc phải lớn hơn thời gian bắt đầu.",
      });
      return false;
    }
    return true;
  };

  const calculateTotal = () => {
    if (!fileData || !startTime || !endTime) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng upload file và chọn thời gian hợp lệ.",
      });
      return;
    }

    const start = dayjs(startTime, "HH:mm:ss");
    const end = dayjs(endTime, "HH:mm:ss");

    if (!start.isValid() || !end.isValid()) {
      notification.error({
        message: "Lỗi định dạng thời gian",
        description: "Thời gian phải có định dạng HH:mm:ss.",
      });
      return;
    }

    if (!validateTime(start, end)) {
      return;
    }

    let totalAmount = 0;
    fileData.forEach((row) => {
      const time = dayjs(row.time, "HH:mm:ss");
      if (time.isValid() && time.isBetween(start, end, null, "[]")) {
        totalAmount += row.amount;
      }
    });

    setTotal(totalAmount.toLocaleString("en-US"));

    if (totalAmount === 0) {
      notification.warning({
        message: "Không có dữ liệu",
        description: `Không có giao dịch nào trong khoảng thời gian từ ${start.format(
          "HH:mm:ss"
        )} đến ${end.format("HH:mm:ss")}.`,
      });
    } else {
      notification.success({
        message: "Thành công",
      });
    }
  };

  const handleChange = (info) => {
    setFileList(info.fileList);
  };

  return (
    <div className="App">
      <h1>Tải lên báo cáo giao dịch</h1>

      <Upload
        beforeUpload={(file) => {
          handleFileUpload(file);
          return false;
        }}
        fileList={fileList}
        onChange={handleChange}
        accept=".xlsx"
      >
        <Button icon={<UploadOutlined />}>Upload Excel File</Button>
      </Upload>

      <div style={{ margin: "20px 0" }}>
        <TimePicker
          placeholder="Chọn thời gian bắt đầu"
          format="HH:mm:ss"
          onChange={(time) =>
            setStartTime(time ? time.format("HH:mm:ss") : null)
          }
          style={{ marginRight: 10, width: 200 }}
        />
        <TimePicker
          placeholder="Chọn thời gian kết thúc"
          format="HH:mm:ss"
          onChange={(time) => setEndTime(time ? time.format("HH:mm:ss") : null)}
          style={{ width: 200 }}
        />
      </div>

      <Button
        type="primary"
        onClick={calculateTotal}
        style={{ margin: "10px" }}
      >
        Tính tổng Thành tiền
      </Button>

      <h2>Tổng: {total} VND</h2>
    </div>
  );
}

export default App;
