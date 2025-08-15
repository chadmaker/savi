"use client"

import type React from "react"
import { useState } from "react"
import { Modal, Select, Slider, Input } from "antd"
import { FilterOutlined } from "@ant-design/icons"

const { Option } = Select

const SelectIndicatorsModalEnhanced: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [reportingLevel, setReportingLevel] = useState("All Reporting Levels")
  const [dataAvailability, setDataAvailability] = useState([2000, 2024])
  const [searchTerm, setSearchTerm] = useState("")

  const showModal = () => {
    setVisible(true)
  }

  const handleOk = () => {
    setVisible(false)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const handleReportingLevelChange = (value: string) => {
    setReportingLevel(value)
  }

  const handleDataAvailabilityChange = (value: number[]) => {
    setDataAvailability(value)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div>
      <button onClick={showModal}>Open Modal</button>
      <Modal
        title="Select Indicators"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1200}
        bodyStyle={{ display: "flex" }}
      >
        <div className="w-96 border-r border-gray-200 bg-gray-50 p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Reporting Level</label>
            <Select value={reportingLevel} onChange={handleReportingLevelChange} style={{ width: "100%" }}>
              <Option value="All Reporting Levels">All Reporting Levels</Option>
              <Option value="Country">Country</Option>
              <Option value="Region">Region</Option>
              <Option value="City">City</Option>
            </Select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Data Availability</label>
            <Slider
              range
              min={1990}
              max={2025}
              defaultValue={dataAvailability}
              onChange={handleDataAvailabilityChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Search</label>
            <Input
              value={searchTerm}
              onChange={handleSearchChange}
              prefix={<FilterOutlined />}
              placeholder="Search indicators"
            />
          </div>
        </div>
        <div className="w-full p-6">{/* Results will be displayed here */}</div>
      </Modal>
    </div>
  )
}

export default SelectIndicatorsModalEnhanced
