import React from "react";

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-md shadow-md border p-5 w-full h-full flex flex-col">
      <h2 className="text-base font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default SectionCard;