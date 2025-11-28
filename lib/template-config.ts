import { User, LayoutTemplate, Sticker, Megaphone } from "lucide-react"
import { generateId } from "./utils"

export const CATEGORIES = {
  PERSON: "person",
  BROCHURE: "brochure",
  STICKER: "sticker",
  AD: "advertisement",
}

export const getDefaultPerson = () => ({
  id: generateId(),
  age: "30",
  gender: "Unspecified",
  ethnicity: "Human",
  hair: "Short brown hair",
  eyes: "Blue eyes",
  outfit: ["Casual shirt", "Jeans"],
  pose: ["Standing neutral"],
})

export const getDefaultItem = (label: string) => ({ id: generateId(), value: label || "" })

export const TEMPLATE_CONFIG: any = {
  [CATEGORIES.PERSON]: {
    icon: User,
    label: "Realistic Person(s)",
    description: "Define demographics, features, and fashion for one or more subjects.",
    initialState: () => ({
      subjects: [getDefaultPerson()],
      environment: { location: "city park", lighting: "daylight" },
      technical: { camera: "50mm lens", style: "photorealistic" },
      customFields: [],
    }),
    fields: [
      { id: "age", label: "Age", placeholder: "e.g., 25 years old", section: "Subject" },
      { id: "gender", label: "Gender", placeholder: "e.g., Female", section: "Subject" },
      { id: "ethnicity", label: "Ethnicity", placeholder: "e.g., Japanese-French mix", section: "Subject" },
      { id: "hair", label: "Hair Style", placeholder: "e.g., Platinum blonde bob", section: "Features" },
      { id: "eyes", label: "Eye Details", placeholder: "e.g., Heterochromia, sharp gaze", section: "Features" },
    ],
    arrayFields: [
      { id: "outfit", label: "Outfit Items", placeholder: "e.g., Cyberpunk raincoat", section: "Apparel" },
      { id: "pose", label: "Pose & Action", placeholder: "e.g., Looking over shoulder", section: "Composition" },
    ],
    globalFields: [
      { id: "location", label: "Location", placeholder: "e.g., Rainy neon street", section: "Environment" },
      { id: "lighting", label: "Lighting", placeholder: "e.g., Cyan and magenta reflections", section: "Environment" },
      { id: "camera", label: "Camera Lens", placeholder: "e.g., 85mm portrait lens", section: "Technical" },
      { id: "style", label: "Art Style", placeholder: "e.g., photorealistic", section: "Technical" },
    ],
    generate: (data: any) => {
      const custom_settings = data.customFields.reduce((acc: any, field: any) => {
        if (field.key && field.value) acc[field.key] = field.value
        return acc
      }, {})
      return {
        action: "generate_image",
        subjects: data.subjects.map((subj: any) => ({
          type: "person",
          demographics: {
            age: subj.age || "unspecified",
            gender: subj.gender || "unspecified",
            ethnicity: subj.ethnicity || "unspecified",
          },
          physical_features: {
            hair: subj.hair || "natural",
            eyes: subj.eyes || "natural",
          },
          apparel: {
            description: subj.outfit.filter(Boolean).join(", ") || "casual clothing",
          },
          pose: {
            description: subj.pose.filter(Boolean).join(" and ") || "standing neutral",
          },
        })),
        environment: {
          location: data.environment?.location || "studio background",
          lighting: data.environment?.lighting || "soft studio lighting",
        },
        technical: {
          camera: data.technical?.camera || "50mm lens",
          style: data.technical?.style || "photorealistic",
        },
        ...(Object.keys(custom_settings).length > 0 && { custom_settings }),
      }
    },
  },
  [CATEGORIES.BROCHURE]: {
    icon: LayoutTemplate,
    label: "Brochure Mockup",
    description: "Layouts for tri-folds, bi-folds, and print materials.",
    initialState: () => ({
      type: "Tri-fold",
      state: "Slightly open, standing",
      theme: "Minimalist Medical",
      colors: "Teal, White, Grey",
      background: "Clean white studio",
      contentPanels: [getDefaultItem("Cover Headline: INNOVATION"), getDefaultItem("Inner Panel: Key Features")],
      fontStyle: "Modern Sans-serif",
      foldStyle: "Z-fold, clean creases",
      customFields: [],
    }),
    fields: [
      { id: "type", label: "Brochure Type", placeholder: "e.g., Tri-fold, Bi-fold, Z-fold", section: "Object" },
      { id: "state", label: "State/View", placeholder: "e.g., Slightly open, lying flat", section: "Object" },
      {
        id: "foldStyle",
        label: "Fold Style/Creases",
        placeholder: "e.g., Clean creases, worn edges",
        section: "Object",
      },
      {
        id: "theme",
        label: "Design Theme",
        placeholder: "e.g., Minimalist Medical, Retro Travel",
        section: "Design Specs",
      },
      {
        id: "colors",
        label: "Color Palette (Comma Separated)",
        placeholder: "e.g., Teal, White, Grey",
        section: "Design Specs",
      },
      {
        id: "fontStyle",
        label: "Font Style",
        placeholder: "e.g., Bold Serif, Clean Sans-serif",
        section: "Design Specs",
      },
      {
        id: "background",
        label: "Background/Surface",
        placeholder: "e.g., Clean white studio, concrete table",
        section: "Render",
      },
    ],
    arrayFields: [
      {
        id: "contentPanels",
        label: "Content Sections/Panels",
        placeholder: "e.g., Headline, Body Text, CTA, Image",
        section: "Layout",
      },
    ],
    generate: (data: any) => {
      const custom_settings = data.customFields.reduce((acc: any, field: any) => {
        if (field.key && field.value) acc[field.key] = field.value
        return acc
      }, {})
      return {
        task: "design_mockup",
        object: {
          type: data.type || "tri-fold brochure",
          state: data.state || "lying flat",
          fold_style: data.foldStyle || "clean creases",
          perspective: "isometric view",
        },
        design_specs: {
          color_palette: data.colors ? data.colors.split(",").map((s: string) => s.trim()) : ["blue", "white"],
          theme: data.theme || "modern corporate",
          typography: data.fontStyle || "clean sans-serif",
        },
        content_layout: {
          panels: data.contentPanels.map((p: any) => p.value).filter(Boolean),
        },
        render_quality: {
          background: data.background || "solid color",
          lighting: "studio softbox",
          resolution: "4k product render",
        },
        ...(Object.keys(custom_settings).length > 0 && { custom_settings }),
      }
    },
  },
  [CATEGORIES.STICKER]: {
    icon: Sticker,
    label: "Sticker Design",
    description: "Die-cut stickers, emojis, and vector art.",
    initialState: () => ({
      subject: "Cute robot cat",
      emotion: "Happy",
      style: "Kawaii Vector",
      border: "Thick white die-cut border",
      palette: "Pastel pinks and purples",
      text: "Hello World",
      texture: "Matte vinyl finish",
      textPlacement: "Below Subject",
      customFields: [],
    }),
    fields: [
      { id: "subject", label: "Subject/Icon", placeholder: "e.g., Holographic skull", section: "Content" },
      { id: "emotion", label: "Emotion/Action", placeholder: "e.g., Happy, flying, winking", section: "Content" },
      { id: "text", label: "Text/Caption", placeholder: 'e.g., "Gamer Life"', section: "Content" },
      {
        id: "textPlacement",
        label: "Text Placement",
        placeholder: "e.g., Below Subject, Wrapped Around",
        section: "Content",
      },
      { id: "style", label: "Art Style", placeholder: "e.g., Kawaii, Vector, Graffiti", section: "Style" },
      {
        id: "palette",
        label: "Colors (Comma Separated)",
        placeholder: "e.g., Pastel pinks and purples",
        section: "Style",
      },
      { id: "border", label: "Border", placeholder: "e.g., Thick white die-cut border", section: "Output Specs" },
      {
        id: "texture",
        label: "Texture/Finish",
        placeholder: "e.g., Matte vinyl finish, holographic",
        section: "Output Specs",
      },
    ],
    arrayFields: [
      {
        id: "contentPanels",
        label: "Content Sections/Panels",
        placeholder: "e.g., Headline, Body Text, CTA, Image",
        section: "Layout",
      },
    ],
    generate: (data: any) => {
      const custom_settings = data.customFields.reduce((acc: any, field: any) => {
        if (field.key && field.value) acc[field.key] = field.value
        return acc
      }, {})
      return {
        type: "sticker_design",
        subject: {
          description: data.subject || "icon",
          expression: data.emotion || "neutral",
        },
        style_specs: {
          art_style: data.style || "flat vector",
          color_scheme: data.palette ? data.palette.split(",").map((s: string) => s.trim()) : ["vibrant"],
          caption: data.text || "",
        },
        technical: {
          border_type: data.border || "white die-cut outline",
          render: "2D vector illustration",
          finish: data.texture || "matte vinyl texture",
          caption_placement: data.textPlacement || "transparent background",
        },
        ...(Object.keys(custom_settings).length > 0 && { custom_settings }),
      }
    },
  },
  [CATEGORIES.AD]: {
    icon: Megaphone,
    label: "Banner/Display Ad",
    description: "Digital advertisements for websites, social media, and apps.",
    initialState: () => ({
      product: "Electric Sports Car",
      type: "Banner Ad",
      size: "728x90 (Leaderboard)",
      headline: "SILENCE IS FAST",
      cta: "Test Drive Today",
      visual: "Car blurring through a tunnel of light",
      mood: "High energy, futuristic",
      audience: "Tech Enthusiasts, 25-45",
      placement: "Top of website, centered",
      customFields: [],
    }),
    fields: [
      { id: "product", label: "Product/Service", placeholder: "e.g., Luxury Perfume", section: "Campaign" },
      { id: "type", label: "Ad Format", placeholder: "e.g., Banner Ad, Display Ad, Skyscraper", section: "Campaign" },
      { id: "audience", label: "Target Audience", placeholder: "e.g., Millennials, Home Owners", section: "Campaign" },
      {
        id: "size",
        label: "Ad Size/Ratio",
        placeholder: "e.g., 300x250 (Medium Rectangle), 16:9",
        section: "Placement",
      },
      {
        id: "placement",
        label: "Placement/Context",
        placeholder: "e.g., Top of website, inside mobile app",
        section: "Placement",
      },
      { id: "headline", label: "Headline Copy", placeholder: "e.g., SMELL LIKE VICTORY", section: "Copy" },
      { id: "cta", label: "Call to Action", placeholder: "e.g., Shop Now button", section: "Copy" },
      { id: "visual", label: "Main Visual", placeholder: "e.g., Bottle splashing in water", section: "Creative" },
      { id: "mood", label: "Mood/Tone", placeholder: "e.g., Energetic, Luxurious", section: "Creative" },
    ],
    generate: (data: any) => {
      const custom_settings = data.customFields.reduce((acc: any, field: any) => {
        if (field.key && field.value) acc[field.key] = field.value
        return acc
      }, {})
      return {
        task: "generate_digital_advertisement",
        campaign_specs: {
          product: data.product || "Generic Product",
          format: data.type || "Banner Ad",
          target_audience: data.audience || "general",
        },
        creative_elements: {
          main_visual: data.visual || "product shot",
          mood: data.mood || "engaging",
          size_and_ratio: data.size || "1:1 square",
        },
        copy_elements: {
          headline: data.headline || "HEADLINE GOES HERE",
          cta_button: data.cta || "Learn More",
          placement_context: data.placement || "generic website placement",
          font_style: "bold legible",
        },
        ...(Object.keys(custom_settings).length > 0 && { custom_settings }),
      }
    },
  },
}

export const EXAMPLES: any = {
  [CATEGORIES.PERSON]: {
    subjects: [
      {
        id: generateId(),
        age: "28",
        gender: "Female",
        ethnicity: "Cybernetic Android",
        hair: "Translucent fiber optic cables",
        eyes: "Glowing red LED rings",
        outfit: ["Distressed white ceramic armor plates", "Glowing blue visor"],
        pose: ["Floating in zero gravity", "Looking directly at the viewer"],
      },
      {
        id: generateId(),
        age: "60",
        gender: "Male",
        ethnicity: "Mechanic",
        hair: "Greasy buzzcut",
        eyes: "Worn goggles",
        outfit: ["Dirty denim overalls", "Welding gloves"],
        pose: ["Crouching down", "Holding a wrench"],
      },
    ],
    environment: {
      location: "Inside a derelict space station",
      lighting: "Harsh emergency strobe lights",
      camera: "Wide angle action shot",
      style: "cyberpunk, hyper-detailed",
    },
    customFields: [],
  },
  [CATEGORIES.BROCHURE]: {
    type: "Tri-fold menu",
    state: "standing upright, accordion style",
    foldStyle: "Clean, perfect creases",
    theme: "Rustic Italian Bistro",
    colors: "Burnt orange, olive green, cream",
    background: "Wooden table surface",
    fontStyle: "Handwritten Serif",
    contentPanels: [
      { id: generateId(), value: "Cover: Restaurant Logo and Name" },
      { id: generateId(), value: "Panel 2: Appetizers and Drinks List" },
      { id: generateId(), value: "Panel 3: Main Courses and Chefs Special" },
    ],
    customFields: [{ id: generateId(), key: "print_finish", value: "Matte, textured paper" }],
  },
  [CATEGORIES.STICKER]: {
    subject: "Holographic skull",
    emotion: "Laughing",
    style: "Vaporwave Glitch Art",
    border: "Neon green glow outline",
    palette: "Cyan, Magenta, Yellow",
    text: "8-BIT HERO",
    texture: "Glossy metallic finish",
    textPlacement: "Wrapped around subject",
    customFields: [{ id: generateId(), key: "background_color", value: "Dark purple" }],
  },
  [CATEGORIES.AD]: {
    product: "Electric Sports Car",
    type: "Display Ad",
    size: "1200x628 (Facebook Feed)",
    headline: "SILENCE IS FAST",
    cta: "Test Drive Today",
    visual: "Car blurring through a tunnel of light",
    mood: "High energy, futuristic",
    audience: "Affluent Buyers, Eco-Conscious",
    placement: "Mobile app ad slot",
    customFields: [{ id: generateId(), key: "animation_style", value: "Subtle parallax effect" }],
  },
}
