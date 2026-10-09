import { DocumentProps, pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import React, { cloneElement, ReactElement } from "react";

interface GeneratePdfButtonProps {
  // Can be static element or a function that returns it after fetching data
  documentComponent:
    | ReactElement<DocumentProps>
    | (() => Promise<ReactElement<DocumentProps>>);
  fileName?: string;
  Button: ReactElement<{ onClick?: () => void; disabled?: boolean }>;
}

export const GeneratePdfButton: React.FC<GeneratePdfButtonProps> = ({
  documentComponent,
  fileName = "document.pdf",
  Button,
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const doc =
        typeof documentComponent === "function"
          ? await documentComponent()
          : documentComponent;

      const blob = await pdf(doc).toBlob();
      saveAs(blob, fileName);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>{cloneElement(Button, { onClick: handleGenerate, disabled: loading })}</>
  );
};
