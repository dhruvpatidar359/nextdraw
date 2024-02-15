import store from "@/app/store";
import { setElement } from "@/components/Redux/features/elementSlice";
import { toast } from "@/components/ui/use-toast";

export const save = (elements) => {
  if (elements.length == 0) {
    toast({
      title: "Uh oh! Canvas is Empty.",
      description: "You hav't drawn anything YET",
      duration: 3000
    });
    return;
  }
  // Serialize elements to JSON
  const elementsJSON = JSON.stringify(elements);

  // Create a Blob with the JSON data
  const blob = new Blob([elementsJSON], { type: 'application/json' });

  // Create a link element
  const a = document.createElement('a');
  a.href = window.URL.createObjectURL(blob);

  // Specify the filename with custom extension
  a.download = 'elements_list.nextdraw';

  // Append the link to the body
  document.body.appendChild(a);

  // Trigger a click event to download the file
  a.click();

  // Clean up
  window.URL.revokeObjectURL(a.href);
  document.body.removeChild(a);


}



export const open = async () => {
  try {

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.nextdraw';

    input.multiple = false;


    input.click();


    input.addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {

        const fileContent = await readFileAsync(file);
        // console.log();
        store.dispatch(setElement([JSON.parse(fileContent), true]))
        // josnObj.map(val => {
        //   console.log(val)
        // })
        // store.dispatch()
      } catch (error) {
        toast({
          title: "Error Importing File",
          description: error,
          duration: 3000
        });
      }
    });
  } catch (error) {
    toast({
      title: "Error Opening File",
      description: error,
      duration: 3000
    });
  }
};


const readFileAsync = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsText(file);
  });
};
