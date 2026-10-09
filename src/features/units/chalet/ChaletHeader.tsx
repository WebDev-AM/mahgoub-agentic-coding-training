import SearchUnits from "../SearchUnits";

function ChaletHeader() {
  return (
    <div className="container-fix container flex w-[90%] flex-col items-center p-4">
      {/* start search chalets component  */}
      <SearchUnits />
      {/* end search chalets component  */}
    </div>
  );
}

export default ChaletHeader;
