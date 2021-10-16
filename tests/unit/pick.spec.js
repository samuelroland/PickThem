import { mount } from "@vue/test-utils";
import Pick from "@/components/Pick.vue";

test("App name is visible", () => {
  //Arrange
  const wrapper = mount(Pick);

  //Assert
  expect(wrapper.text()).toContain("PickThem");
});

test("Basic information are visible", () => {
  //Arrange
  const wrapper = mount(Pick);

  //Assert
  expect(wrapper.text()).toContain("GNU AGPLv3");
  expect(wrapper.text()).toContain("licence libre");
  expect(wrapper.text()).toContain("Samuel Roland");
  expect(wrapper.text()).toContain("code source");
});
