/**
 * @jest-environment jsdom
 */

//import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
import {screen, waitFor} from "@testing-library/dom"
import { fireEvent } from "@testing-library/dom";
import userEvent from '@testing-library/user-event'
import mockStore from "../__mocks__/store"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () =>  {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon).toBeTruthy()
    })
  })
})

describe("Given that I am an employee trying to make a New Bill", () => {
  describe("When I do not fill fields and I click on Envoyer button", () => {
    test("Then It should renders New Bill page", () => {
      document.body.innerHTML = NewBillUI();

      const inputDate = screen.getByTestId("datepicker");
      expect(inputDate.value).toBe("");

      const inputAmount = screen.getByTestId("amount");
      expect(inputAmount.value).toBe("");

      const inputFile = screen.getByTestId("file");
      expect(inputFile.value).toBe("");

      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
    });
  })
})


// Vérifie que le btn Choose File est bien appelé
describe('Given I am connected as Employee and I am on New Bill page and I clicked on "Choose a file"', () => {
  describe('When I click on the button', () => {
    test('Then finder open', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      const file = new NewBill({
        document, localStorage: window.localStorage
      })

      const newBill = screen.getAllByTestId('file')[0]
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      newBill.addEventListener('click', handleChangeFile)
      userEvent.click(newBill)
      expect(handleChangeFile).toHaveBeenCalled()
    })
  })
})

// Vérifie que le format de téléchargement des fichiers est bon
describe('Given I am connected as Employee and I am on New Bill page and I clicked on "Choose a file"', () => {
  describe('When I choose a file in the finder', () => {
    test('Then format of file is jpg', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ data: [], pathname });
      };

      const testFile = new File([""], "test.jpg", {type:"image/jpg"})
      //const testFile = document.querySelector(`input[data-testid="file"]`).files[0]
      window.localStorage.setItem('ext', "jpg")
      const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage })
      const changeFile = jest.fn(newBill.handleChangeFile)
      const file = screen.getByTestId("file")

      file.addEventListener("change", changeFile)
      fireEvent.change(file, {
        target: {
          files: [testFile]
        }
      })
       
      expect(changeFile).toHaveBeenCalled()
    })
  })
  describe('When I choose a file in the finder', () => {
    test('Then format of file is jpeg', () => {
      
      // const fileExtension = 'jpg';
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ data: [], pathname });
      };

      const testFile = new File([""], "test.jpeg", {type:"image/jpeg"})
      //const testFile = document.querySelector(`input[data-testid="file"]`).files[0]
      window.localStorage.setItem('ext', "jpeg")
      const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage })
      const changeFile = jest.fn(newBill.handleChangeFile)
      const file = screen.getByTestId("file")

      file.addEventListener("change", changeFile)
      fireEvent.change(file, {
        target: {
          files: [testFile]
        }
      })
       
      expect(changeFile).toHaveBeenCalled()
    })
  })

  describe('When I choose a file in the finder', () => {
    test('Then format of file is png', () => {
      
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ data: [], pathname });
      };

      const testFile = new File([""], "test.png", {type:"image/png"})
      //const testFile = document.querySelector(`input[data-testid="file"]`).files[0]
      window.localStorage.setItem('ext', "png")
      const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage })
      const changeFile = jest.fn(newBill.handleChangeFile)
      const file = screen.getByTestId("file")

      file.addEventListener("change", changeFile)
      fireEvent.change(file, {
        target: {
          files: [testFile]
        }
      })
       
      expect(changeFile).toHaveBeenCalled()
    })
  })
})

// Test d'intégration POST
describe("When I click on submit button of the form", () => {
  test('It should create a new bill', () => {
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    const formData = new FormData()
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
    window.localStorage.setItem('formData', formData)
    const html = NewBillUI()
    document.body.innerHTML = html
    const newBill = new NewBill({
      document,
      onNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    });
    const handleSubmit = jest.fn(() => newBill.handleSubmit)
    const newBillform = screen.getByTestId("form-new-bill")
    newBillform.addEventListener('submit', handleSubmit)
    fireEvent.submit(newBillform)
    expect(handleSubmit).toHaveBeenCalled()
  })
})
test('Then i have posted a bill from my MockedApi', async () => {
  //Récupéré dans le mock storage
  const myNewBill = [
    {
      "id": "47qAXb6fIm2zOKkLzMro",
      "vat": "80",
      "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
      "status": "pending",
      "type": "Hôtel et logement",
      "commentary": "séminaire billed",
      "name": "encore",
      "fileName": "preview-facture-free-201801-pdf-1.jpg",
      "date": "2004-04-04",
      "amount": 400,
      "commentAdmin": "ok",
      "email": "a@a",
      "pct": 20
    }
  ]
  const SpyOn = jest.spyOn(mockStore, 'bills')
  await mockStore.bills(myNewBill)
  expect(SpyOn).toHaveBeenCalled()
})


