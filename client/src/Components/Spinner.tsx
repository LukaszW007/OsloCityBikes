import React from "react";
import "./Spinner.css";

export function Spinner() {
  return (
    <div className="flex justify-center w-screen h-screen">
      <div className="w-12 h-12 border-4 border-blue-600 rounded-full loader"></div>
    </div>
  );
}
export function SpinnerBike() {
  return (
    <div className="flex justify-center h-screen">
      <div className="bike">
        <div className="wheel wheel__left">
          <div className="spoke spoke__left--1"></div>
          <div className="spoke spoke__left--2"></div>
          <div className="hub"></div>
        </div>
        <div className="wheel wheel__right">
          <div className="spoke spoke__right--1"></div>
          <div className="spoke spoke__right--2"></div>
          <div className="hub"></div>
        </div>
        <div className="fork"></div>
        <div className="chainring"></div>
        <div className="down-tube"></div>
        <div className="top-tube"></div>
        <div className="seat-tube"></div>
        <div className="seat-stay"></div>
        <div className="chain-stay"></div>
        <div className="chain__upper"></div>
        <div className="chain__bottom"></div>
        <div className="saddle"></div>
        <div className="handlebars"></div>
      </div>
    </div>
  );
}
