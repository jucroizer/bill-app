/**
 * @jest-environment jsdom
 */

 import {screen, waitFor} from "@testing-library/dom"
 import {toHaveClass} from "@testing-library/jest-dom"
 import userEvent from '@testing-library/user-event'
 import BillsUI from "../views/BillsUI.js"
 import Bills from "../containers/Bills.js"
 import { bills } from "../fixtures/bills.js"
 import { ROUTES_PATH, ROUTES} from "../constants/routes.js";
 import {localStorageMock} from "../__mocks__/localStorage.js";
 
 import router from "../app/Router.js";
 import store from "../__mocks__/store.js"
 import { formatDate, formatStatus } from "../app/format.js"
 
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
       expect(windowIcon).toHaveClass('active-icon')
     })
     test("Then bills should be ordered from earliest to latest", () => {
       document.body.innerHTML = BillsUI({ data: bills })
       const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
       const antiChrono = (a, b) => ((a > b) ? -1 : 1)
       const datesSorted = [...dates].sort(antiChrono)
       expect(dates).toEqual(datesSorted)
     })
     
     //new tests
     test("Then click on eye icon should shows the modal", async () => {
       $.fn.modal = jest.fn()
       document.body.innerHTML = BillsUI({data: bills})
       await waitFor(() => screen.getAllByTestId('icon-eye'))
       Object.defineProperty(window, "localStorage", { value: { getItem: jest.fn(() => null), setItem: jest.fn(() => null) } },
       )
       const onNavigate = (pathname) => {
         document.body.innerHTML = ROUTES({ data: [], pathname });
       };
       const firebase = jest.fn()
       
       const bill = new Bills({ document, onNavigate, firebase, localStorage: window.localStorage })
       const handleClickIconEye = jest.fn(bill.handleClickIconEye);
       const iconEyes = screen.getAllByTestId('icon-eye')
       const iconEye = iconEyes[0]
       iconEye.addEventListener("click", handleClickIconEye(iconEye))
       userEvent.click(iconEye)
       await waitFor(() => screen.getByText('Justificatif'))
       const modal = screen.getByText('Justificatif')
       expect(modal).toBeDefined()
       expect(handleClickIconEye).toHaveBeenCalled()
     })
 
     test("Then when i click on 'new bill' i should be redirected on newbill page", async () => {
       document.body.innerHTML = BillsUI({ data: bills })
       const onNavigate = (pathname) => {
         document.body.innerHTML = ROUTES({ data: [], pathname });
       };
       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee'
       }))
       const root = document.createElement("div")
       root.setAttribute("id", "root")
       document.body.append(root)
       router()
       window.onNavigate(ROUTES_PATH.Bills)
       const firebase = store;
       const bill = new Bills({ document, onNavigate, firebase, localStorage: window.localStorage })
 
       await waitFor(() => screen.getByTestId('btn-new-bill'))
       const newBillBtn = screen.getByTestId('btn-new-bill');
       const handleClickNewBill = jest.fn(bill.handleClickNewBill);
       newBillBtn.addEventListener('click', handleClickNewBill)
       userEvent.click(newBillBtn);
       await waitFor(() => screen.getByTestId('form-new-bill'))
       expect(handleClickNewBill).toHaveBeenCalled()
       expect(window.location.href).toBe('http://localhost/#employee/bill/new')
     })
 
     test("Then snapshot should be valid", async () => {
       const onNavigate = (pathname) => {
         document.body.innerHTML = ROUTES({ data: [], pathname });
       };
       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee'
       }))
       const bill = new Bills({ document, onNavigate, store, localStorage: window.localStorage })
       const snapshot = await bill.getBills()
       const mockedBills = await store.bills().list()
       mockedBills.sort((a, b) => ((a.date > b.date) ? 1 : -1))
       mockedBills.map(doc => {
         doc.date = formatDate(doc.date)
         doc.status = formatStatus(doc.status)
       })
       expect(snapshot).toEqual(mockedBills);
     })
 
       describe("When I navigate to Bills", () => {
       
         test("then bills from an API and fails with 404 message error", async () => {
           store.bills(() =>
             Promise.reject(new Error("Erreur 404"))
           );
           const html = BillsUI({ error: "Erreur 404" });
           document.body.innerHTML = html;
           const message = await screen.getByText(/Erreur 404/);
           expect(message).toBeTruthy();
     
         });
         test("then messages from an API and fails with 500 message error", async () => {
           store.bills(() =>
             Promise.reject(new Error("Erreur 500"))
           );
           const html = BillsUI({ error: "Erreur 500" });
           document.body.innerHTML = html;
           const MyMessage = await screen.getByText(/Erreur 500/);
           expect(MyMessage).toBeTruthy();
     
         });
       });
   })
 })


// /**
//  * @jest-environment jsdom
//  */

//  import {fireEvent, screen, waitFor} from "@testing-library/dom"
//  import BillsUI from "../views/BillsUI.js"
//  import { bills } from "../fixtures/bills.js"
//  import userEvent from '@testing-library/user-event'
//  import mockStore from "../__mocks__/store"
//  import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
//  //import $ from 'jquery';
//  // import { ROUTES_PATH} from "../constants/routes.js";
//  import {localStorageMock} from "../__mocks__/localStorage.js";
 
//  import router from "../app/Router.js";
//  import Bills from "../containers/Bills.js"
 
//  describe("Given I am connected as an employee", () => {
//    describe("When I am on Bills Page", () => {
//      test("Then bill icon in vertical layout should be highlighted", async () => {
 
//        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
//        window.localStorage.setItem('user', JSON.stringify({
//          type: 'Employee'
//        }))
//        const root = document.createElement("div")
//        root.setAttribute("id", "root")
//        document.body.append(root)
//        router()
//        window.onNavigate(ROUTES_PATH.Bills)
//        await waitFor(() => screen.getByTestId('icon-window'))
//        const windowIcon = screen.getByTestId('icon-window')
//        //to-do write expect expression
//        expect(windowIcon).toBeTruthy()
//      })
//      test("Then bills should be ordered from earliest to latest", () => {
//        document.body.innerHTML = BillsUI({ data: bills })
//        const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
//        const antiChrono = (a, b) => ((a < b) ? 1 : -1)
//        const datesSorted = [...dates].sort(antiChrono)
//        expect(dates).toEqual(datesSorted)
//      })
//    })
//  })

//  describe("Given la bonne page", () => {
//   describe("When", () => {
//     test("Should give me Loading Page if loading is true", () => {
//       const html = BillsUI({ data: bills, loading: true })
//       document.body.innerHTML = html
//       expect(screen.getByTestId("loading_test")).toBeTruthy()
//     })
//   })
//  })
 
//  describe('Given I am connected as Employee and I am on Dashboard page and I clicked on "New Bill"', () => {
//    describe('When I click on the button', () => {
//      test('Then a new page open', () => {
//        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
//        window.localStorage.setItem('user', JSON.stringify({
//          type: 'Employee'
//        }))
//        const root = document.createElement("div")
//        root.setAttribute("id", "root")
//        document.body.append(root)
//        router()
//        window.onNavigate(ROUTES_PATH.NewBill)
//        const bill = new Bills({
//          document, onNavigate, bills, localStorage: window.localStorage
//        })
 
//        const handleClickNewBill = jest.fn(bill.handleClickNewBill)
//        const newBill = screen.getByTestId('btn-new-bill')
//        newBill.addEventListener('click', handleClickNewBill)
//        userEvent.click(newBill)
//        expect(handleClickNewBill).toHaveBeenCalled()
//      })
//    })
//  })
 
//  // Test d'ouverture du justificatif avec l'icon eye
//  describe('Given I am connected as Employee and I am on Dashboard page and I clicked on icon eye', () => {
//    describe('When I click on the icon eye', () => {
//      test('Then should called function handleClickIconEye', () => {
//        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
//        window.localStorage.setItem('user', JSON.stringify({
//          type: 'Employee'
//        }))
//        const root = document.createElement("div")
//        root.setAttribute("id", "root")
//        document.body.append(root)
//        router()
//        window.onNavigate(ROUTES_PATH.NewBill)
//        const bill = new Bills({
//          document, bills, localStorage: window.localStorage
//        })
 
//        const eye = screen.getAllByTestId('icon-eye')[0]
//        const handleClickIconEye = jest.fn(bill.handleClickIconEye(eye))
//        eye.addEventListener('click', handleClickIconEye)
//        userEvent.click(eye)
//        expect(handleClickIconEye).toHaveBeenCalled()
//      })
//      test('Then should open modal when i click on que IconEye', () => {
//        $.fn.modal = jest.fn()
//        const html = BillsUI({ data: bills })
//        document.body.innerHTML = html
//        Object.defineProperty(window, "localStorage", { value: { getItem: jest.fn(() => null), setItem: jest.fn(() => null) } },
//        )
 
//        const onNavigate = (pathname) => {
//          document.body.innerHTML = ROUTES({ data: [], pathname });
//        };
//        const firebase = jest.fn()
//        const bill = new Bills({ document, onNavigate, firebase, localStorage: window.localStorage })
 
//        const handleClickIconEye = jest.fn(bill.handleClickIconEye);
 
//        const iconsEye = screen.getAllByTestId(`icon-eye`)
//        const firstEye = iconsEye[0]
//        firstEye.addEventListener("click", handleClickIconEye(firstEye))
//        userEvent.click(firstEye)
 
//        expect($.fn.modal).toHaveBeenCalled()
//      })
//    })
//  })
 
//  // Test d'intégration GET
//  describe("Given I am a user connected as Employee", () => {
//    describe("When I navigate to Dashboard", () => {
//     // test("Should give me Loading Page if loading is true", () => {
//     //   const html = BillsUI({ data: bills, loading: true })
//     //   document.body.innerHTML = html
//     //   expect(screen.getByTestId("loading_test")).toBeTruthy()
//     // })
//     // test("Should give me error Page if loading is not defined ", () => {
//     //   const html = BillsUI({ data: bills, error: true })
//     //   document.body.innerHTML = html
//     //   expect(screen.queryByTestId("error-message")).toBeTruthy()
//     // })
//      test("fetches bills from mock API GET", async () => {
//        localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
//        const root = document.createElement("div")
//        root.setAttribute("id", "root")
//        document.body.append(root)
//        router()
//        window.onNavigate(ROUTES_PATH.Bills)
//        await waitFor(() => screen.getByText("Mes notes de frais"))
//        const btnAddBill  = await screen.getByText("Nouvelle note de frais")
//        expect(btnAddBill).toBeTruthy()
//      })
//      test("Then eye icon in vertical layout should be highlighted", async () => {
//        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
//        window.localStorage.setItem('user', JSON.stringify({
//          type: 'Employee'
//        }))
//        const root = document.createElement("div")
//        root.setAttribute("id", "root")
//        document.body.append(root)
//        router()
//        window.onNavigate(ROUTES_PATH.Bills)
//        const windowIcon = screen.getAllByTestId('icon-eye')
//        expect(windowIcon).toBeTruthy() 
//      })
//      test("Then a bills report table is displayed", async () => {
//        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
//        window.localStorage.setItem('user', JSON.stringify({
//          type: 'Employee'
//        }))
//        const root = document.createElement("div")
//        root.setAttribute("id", "root")
//        document.body.append(root)
//        router()
//        window.onNavigate(ROUTES_PATH.Bills)
//        const tabBills = screen.getAllByTestId('tbody')
//        expect(tabBills).toBeTruthy() 
//      })
//      test("Then a bills status report column is displayed", async () => {
//       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
//       window.localStorage.setItem('user', JSON.stringify({
//         type: 'Employee'
//       }))
//       const root = document.createElement("div")
//       root.setAttribute("id", "root")
//       document.body.append(root)
//       router()
//       window.onNavigate(ROUTES_PATH.Bills)
//       const statutBills = screen.getAllByText('Statut')
//       expect(statutBills).toBeTruthy() 
//     })
//      test('Then should display the title', () => {
//        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
//        window.localStorage.setItem('user', JSON.stringify({
//          type: 'Employee'
//        }))
//        const root = document.createElement("div")
//        root.setAttribute("id", "root")
//        document.body.append(root)
//        router()
//        window.onNavigate(ROUTES_PATH.Bills)
      
//        const header = screen.getByText("Mes notes de frais")
//        expect(header).toBeTruthy()
//      });
//      test('Then should display the new bill button', () => {
//        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
//        window.localStorage.setItem('user', JSON.stringify({
//          type: 'Employee'
//        }))
//        const root = document.createElement("div")
//        root.setAttribute("id", "root")
//        document.body.append(root)
//        router()
//        window.onNavigate(ROUTES_PATH.Bills)
      
//        const btnNewBill = screen.getByTestId("btn-new-bill")
//        expect(btnNewBill).toBeTruthy()
//      });
//    describe("When an error occurs on API", () => {
//      beforeEach(() => {
//        jest.spyOn(mockStore, "bills")
//        Object.defineProperty(
//            window,
//            'localStorage',
//            { value: localStorageMock }
//        )
//        window.localStorage.setItem('user', JSON.stringify({
//          type: 'Employee',
//          email: "a@a"
//        }))
//        const root = document.createElement("div")
//        root.setAttribute("id", "root")
//        document.body.appendChild(root)
//        router()
//      })
//      test("Then fetches bills from an API and fails with 404 message error", async () => {
 
//        jest.spyOn(mockStore, 'bills').mockImplementationOnce(() => Promise.reject(new Error('Erreur 404')));
//            document.body.innerHTML = BillsUI({ error: 'Erreur 404' });
//        const message = await screen.getByText("Erreur 404")
//        expect(message).toBeTruthy()
//      })
//      test("Then fetches messages from an API and fails with 500 message error", async () => {
 
//        jest.spyOn(mockStore, 'bills').mockImplementationOnce(() => Promise.reject(new Error('Erreur 500')));
//            document.body.innerHTML = BillsUI({ error: 'Erreur 500' });
//        const message = await screen.getByText("Erreur 500")
//        expect(message).toBeTruthy()
//      })
//    })
 
//    })
//  })