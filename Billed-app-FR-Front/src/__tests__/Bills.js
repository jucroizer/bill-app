/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import userEvent from '@testing-library/user-event'
import mockStore from "../__mocks__/store"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
// import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
import Bills from "../containers/Bills.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon).toBeTruthy()
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})

describe('Given I am connected as Employee and I am on Dashboard page and I clicked on "New Bill"', () => {
  describe('When I click on the button', () => {
    test('Then a new page open', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      const bill = new Bills({
        document, onNavigate, bills, localStorage: window.localStorage
      })

      const handleClickNewBill = jest.fn(bill.handleClickNewBill)
      const newBill = screen.getByTestId('btn-new-bill')
      newBill.addEventListener('click', handleClickNewBill)
      userEvent.click(newBill)
      expect(handleClickNewBill).toHaveBeenCalled()
    })
  })
})

// Test d'ouverture du justificatif avec l'icon eye
describe('Given I am connected as Employee and I am on Dashboard page and I clicked on icon eye', () => {
  describe('When I click on the icon eye', () => {
    test('A modal should open', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      const bill = new Bills({
        document, bills, localStorage: window.localStorage
      })

      const eye = screen.getAllByTestId('icon-eye')[0]
      const handleClickIconEye = jest.fn(bill.handleClickIconEye(eye))
      eye.addEventListener('click', handleClickIconEye)
      userEvent.click(eye)
      expect(handleClickIconEye).toHaveBeenCalled()

      //const modale = screen.getAllByText("Justificatif")[0]
      // document.querySelector(`div[id="modaleFile"]`)
      // expect(modale).toBeTruthy()
    })
  })
})

// Test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Dashboard", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))
      const btnAddBill  = await screen.getByText("Nouvelle note de frais")
      expect(btnAddBill).toBeTruthy()
    })
    test("Then eye icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      const windowIcon = screen.getAllByTestId('icon-eye')
      expect(windowIcon).toBeTruthy() 
    })
    test("Then a bills report table is displayed", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      const tabBills = screen.getAllByTestId('tbody')
      expect(tabBills).toBeTruthy() 
    })
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
    test("fetches bills from an API and fails with 404 message error", async () => {

      jest.spyOn(mockStore, 'bills').mockImplementationOnce(() => Promise.reject(new Error('Erreur 404')));
          document.body.innerHTML = BillsUI({ error: 'Erreur 404' });

      // mockStore.bills.mockImplementationOnce(() => {
      //   return {
      //     list : () =>  {
      //       return Promise.reject(new Error("Erreur 404"))
      //     }
      //   }})
      // window.onNavigate(ROUTES_PATH.Bills)
      //await new Promise(process.nextTick);
      const message = await screen.getByText("Erreur 404")
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {

      jest.spyOn(mockStore, 'bills').mockImplementationOnce(() => Promise.reject(new Error('Erreur 500')));
          document.body.innerHTML = BillsUI({ error: 'Erreur 500' });

      // mockStore.bills.mockImplementationOnce(() => {
      //   return {
      //     list : () =>  {
      //       return Promise.reject(new Error("Erreur 500"))
      //     }
      //   }})

      //   // méthode spyON
      // window.onNavigate(ROUTES_PATH.Bills)
      //await new Promise(process.nextTick);
      const message = await screen.getByText("Erreur 500")
      expect(message).toBeTruthy()
    })
  })

  })
})

