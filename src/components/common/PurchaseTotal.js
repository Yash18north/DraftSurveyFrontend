import React from 'react'
import RenderFields from './RenderFields'
import { Input } from 'reactstrap'

const PurchaseTotal = ({ Totalfields }) => {
  const fields = 
    [
    {
      width: 3,
      label: "Total",
      name: "prd_total",
      type: "text",
      sortName: "prd_total",
      fieldName: "prd_total",
      placeholder: "Total"
    },
    {
      width: 3,
      label: "GST",
      name: "prd_gst",
      type: "text",
      sortName: "prd_gst",
      fieldName: "prd_gst",
      placeholder: "GST"
    },
    {
      width: 3,
      label: "Total GST",
      name: "prd_total_gst",
      type: "text",
      sortName: "prd_total_gst",
      fieldName: "prd_total_gst",
      placeholder: "Total GST"
    }
    ]
  return (
    <div>
      {
        fields.map((field) => {
          return (
            <RenderFields
              field={{ ...field }}
            />
          )
        })
      }

    </div>


  )
}

export default PurchaseTotal
