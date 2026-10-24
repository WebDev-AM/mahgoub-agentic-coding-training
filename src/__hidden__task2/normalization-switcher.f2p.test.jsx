// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ChaletCartProvider } from "../contexts/ChaletCartContext";
import ChaletReservationPeriods from "../features/units/chalet/reservationsPeriods/ChaletReservationPeriods";
import { useChaletReservationPeriods } from "../features/units/chalet/reservationsPeriods/useChaletReservationPeriods";

vi.mock(
  "../features/units/chalet/reservationsPeriods/useChaletReservationPeriods",
  () => ({ useChaletReservationPeriods: vi.fn() })
);

const daily = (start, end) => ({
  price: 25,
  startPeriod: start,
  endPeriod: end,
  typePeriod: "Daily",
  status: "AVAILABLE",
});

const periodic = (start, end) => ({
  price: 100,
  startPeriod: start,
  endPeriod: end,
  typePeriod: "Weekend",
  status: "AVAILABLE",
});

function renderParent(periods, reservationType = "PERIODIC") {
  vi.mocked(useChaletReservationPeriods).mockReturnValue({
    periods,
    isLoading: false,
    error: null,
  });

  return render(
    <MemoryRouter>
      <ChaletCartProvider>
        <ChaletReservationPeriods
          chalet={{ uuid: "chalet-1", reservationType }}
        />
      </ChaletCartProvider>
    </MemoryRouter>
  );
}

const switcherButton = () => screen.queryByRole("button", { name: "Periodic" });

describe("reservation period view switcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("hides the switcher and both views when there are no periods", () => {
    renderParent([]);

    expect(switcherButton()).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Chalet Reservation Days" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Chalet Reservation Periods" })
    ).not.toBeInTheDocument();
  });

  it("shows only the daily picker when periods are daily only", () => {
    renderParent(
      [
        daily("2026-05-01", "2026-05-01"),
        daily("2026-05-02", "2026-05-02"),
      ],
      "DAILY"
    );

    expect(switcherButton()).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Chalet Reservation Days" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Chalet Reservation Periods" })
    ).not.toBeInTheDocument();
  });

  it("shows only the periodic slider when periods are periodic only", () => {
    renderParent([periodic("2026-05-01", "2026-05-02")]);

    expect(switcherButton()).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Chalet Reservation Periods" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Chalet Reservation Days" })
    ).not.toBeInTheDocument();
  });

  it("shows the switcher and both views when both period types exist", async () => {
    const user = userEvent.setup();
    renderParent(
      [
        daily("2026-05-01", "2026-05-01"),
        periodic("2026-05-02", "2026-05-03"),
      ],
      "PERIODIC"
    );

    expect(switcherButton()).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Chalet Reservation Periods" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Chalet Reservation Days" })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Daily" }));

    expect(
      screen.getByRole("heading", { name: "Chalet Reservation Days" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Chalet Reservation Periods" })
    ).not.toBeInTheDocument();
  });
});
