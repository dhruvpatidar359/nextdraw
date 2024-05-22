import store from "@/app/store";
import { setElement } from "@/components/Redux/features/elementSlice";
import { toast } from "@/components/ui/use-toast";

export const save = (elements) => {
  if (elements.length == 0) {
    toast({
      title: "Uh oh! Canvas is Empty.",
      description: "You hav't drawn anything YET",
      duration: 3000,
    });
    return;
  }

  const elementsJSON = JSON.stringify(elements);

  const blob = new Blob([elementsJSON], { type: "application/json" });

  const a = document.createElement("a");
  a.href = window.URL.createObjectURL(blob);

  a.download = "elements_list.nextdraw";

  document.body.appendChild(a);

  a.click();

  window.URL.revokeObjectURL(a.href);
  document.body.removeChild(a);
};

export const open = async () => {
  try {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".nextdraw";

    input.multiple = false;

    input.click();

    input.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const fileContent = await readFileAsync(file);

        store.dispatch(setElement([JSON.parse(fileContent), true, null]));
      } catch (error) {
        toast({
          title: "Error Importing File",
          description: error,
          duration: 3000,
        });
      }
    });
  } catch (error) {
    toast({
      title: "Error Opening File",
      description: error,
      duration: 3000,
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
